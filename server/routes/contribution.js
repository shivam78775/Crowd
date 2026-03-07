import express from "express";
import Campaign from "../models/Campaign.js";
import Contribution from "../models/Contribution.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST /api/contribution/add
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { campaignId, amount, contributorWallet, transactionHash } = req.body;

    if (
      !campaignId ||
      !amount ||
      amount <= 0 ||
      !contributorWallet ||
      !transactionHash
    ) {
      return res.status(400).json({
        message:
          "Valid campaignId, amount, contributor wallet, and transaction hash are required",
      });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.deadline && campaign.deadline < new Date()) {
      return res
        .status(400)
        .json({ message: "This campaign's deadline has passed" });
    }

    const contribution = await Contribution.create({
      campaignId,
      contributor: req.user._id,
      amount,
      contributorWallet,
      transactionHash,
    });

    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { raisedAmount: amount },
      $push: { contributors: contribution._id },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { contributions: contribution._id },
    });

    const updatedCampaign = await Campaign.findById(campaignId)
      .populate("creator", "name")
      .populate({
        path: "contributors",
        populate: { path: "contributor", select: "name" },
      });

    return res.status(201).json({
      contribution,
      campaign: updatedCampaign,
    });
  } catch (err) {
    console.error("Add contribution error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

