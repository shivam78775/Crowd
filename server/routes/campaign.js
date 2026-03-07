import express from "express";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

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

    const campaign = await Campaign.create({
      title,
      description,
      goalAmount,
      deadline,
      imageURL,
      creatorWallet,
      creator: req.user._id,
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
    const campaigns = await Campaign.find()
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

export default router;

