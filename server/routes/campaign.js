import express from "express";
import algosdk from "algosdk";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import Contribution from "../models/Contribution.js";
import { authMiddleware } from "../middleware/auth.js";
import { sendFromEscrow } from "../utils/algorand.js";

const router = express.Router();

// POST /api/campaign/create
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      goalAmount,
      deadline,
      imageURL,
      creatorWallet,
    } = req.body;

    if (
      !title ||
      !description ||
      !goalAmount ||
      !deadline ||
      !imageURL ||
      !creatorWallet
    ) {
      return res
        .status(400)
        .json({ message: "All fields including creator wallet are required" });
    }

    // Generate a unique escrow account for this campaign
    const account = algosdk.generateAccount();
    const escrowAddress = account.addr;
    const escrowMnemonic = algosdk.secretKeyToMnemonic(account.sk);

    const campaign = await Campaign.create({
      title,
      description,
      goalAmount,
      deadline,
      imageURL,
      creatorWallet,
      creator: req.user._id,
      escrowAddress,
      escrowMnemonic,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdCampaigns: campaign._id },
    });

    return res.status(201).json(campaign);
  } catch (err) {
    console.error("Create campaign error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/campaign/all
router.get("/all", async (req, res) => {
  try {
    // Show only active campaigns
    const campaigns = await Campaign.find({ 
      status: "active",
      deadline: { $gt: new Date() } // Also hide expired ones for cleanliness
    })
      .sort({ createdAt: -1 })
      .populate("creator", "name");

    return res.json(campaigns);
  } catch (err) {
    console.error("Get campaigns error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/campaign/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id)
      .populate("creator", "name")
      .populate({
        path: "contributors",
        populate: { path: "contributor", select: "name" },
      });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    return res.json(campaign);
  } catch (err) {
    console.error("Get campaign error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/campaign/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this campaign" });
    }

    campaign.status = "deleted";
    await campaign.save();

    return res.json({ message: "Campaign marked as deleted. Funds are now refundable." });
  } catch (err) {
    console.error("Delete campaign error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/campaign/:id/withdraw
// Creator withdraws if goal reached and deadline passed
router.post("/:id/withdraw", authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    if (campaign.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (campaign.raisedAmount < campaign.goalAmount) {
      return res.status(400).json({ message: "Goal not reached" });
    }

    if (new Date(campaign.deadline) > new Date()) {
      return res.status(400).json({ message: "Deadline has not passed yet" });
    }

    if (campaign.status === "withdrawn") {
      return res.status(400).json({ message: "Funds already withdrawn" });
    }

    if (!campaign.escrowMnemonic) {
      return res.status(400).json({ message: "Escrow account not found for this campaign" });
    }

    // Amount to withdraw in MicroAlgos (raisedAmount is in ALGO)
    const amountMicroAlgos = Math.round(campaign.raisedAmount * 1_000_000);

    // Send funds from escrow to creator wallet
    const txId = await sendFromEscrow(
      campaign.escrowMnemonic,
      campaign.creatorWallet,
      amountMicroAlgos - 2000 // Subtract a small amount for fees
    );

    campaign.status = "withdrawn";
    await campaign.save();

    return res.json({ message: "Withdrawal successful", txId, campaign });
  } catch (err) {
    console.error("Withdrawal error:", err);
    return res.status(500).json({ message: err.message || "Withdrawal failed on chain" });
  }
});

// POST /api/campaign/:id/refund
// Contributor claims refund if campaign deleted or goal not reached after deadline
router.post("/:id/refund", authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const isDeleted = campaign.status === "deleted";
    const deadlinePassed = new Date(campaign.deadline) < new Date();
    const goalMissed = campaign.raisedAmount < campaign.goalAmount;

    if (!isDeleted && !(deadlinePassed && goalMissed)) {
      return res.status(400).json({ message: "Not eligible for refunds yet" });
    }

    const contribution = await Contribution.findOne({
      campaignId: campaign._id,
      contributor: req.user._id,
      status: "funded"
    });

    if (!contribution) {
      return res.status(400).json({ message: "No refundable contribution found" });
    }

    if (!campaign.escrowMnemonic) {
      return res.status(400).json({ message: "Escrow logic not available for this legacy campaign" });
    }

    // Refund Logic
    const amountMicroAlgos = Math.round(contribution.amount * 1_000_000);
    
    // Send back from escrow to contributor wallet
    const txId = await sendFromEscrow(
      campaign.escrowMnemonic,
      contribution.contributorWallet,
      amountMicroAlgos - 2000 // Subtract a small amount for fees
    );

    contribution.status = "refunded";
    contribution.refundTxId = txId;
    await contribution.save();

    return res.json({ message: "Refund processed successfully on Algorand", contribution });
  } catch (err) {
    console.error("Refund error:", err);
    return res.status(500).json({ message: err.message || "Blockchain refund failed" });
  }
});

export default router;

