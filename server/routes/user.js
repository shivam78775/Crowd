import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Campaign from "../models/Campaign.js";
import Contribution from "../models/Contribution.js";
import User from "../models/User.js";

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

    const user = await User.findById(userId).select("notifications name email createdAt");

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        notifications: user.notifications || [],
      },
      myCampaigns,
      myContributions,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/user/notifications/read
router.post("/notifications/read", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { "notifications.$[].read": true }
    });
    return res.json({ message: "Notifications marked as read" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

