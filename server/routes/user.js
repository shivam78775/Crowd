import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Campaign from "../models/Campaign.js";
import Contribution from "../models/Contribution.js";

const router = express.Router();

// GET /api/user/dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const myCampaigns = await Campaign.find({ creator: userId }).sort({
      createdAt: -1,
    });

    const myContributions = await Contribution.find({
      contributor: userId,
    })
      .sort({ contributedAt: -1 })
      .populate("campaignId", "title goalAmount raisedAmount imageURL deadline");

    return res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      myCampaigns,
      myContributions,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

