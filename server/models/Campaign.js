import mongoose from "mongoose";

const { Schema } = mongoose;

const campaignSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    goalAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    creatorWallet: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contributors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Contribution",
      },
    ],
    escrowAddress: {
      type: String,
    },
    escrowMnemonic: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "completed", "failed", "deleted", "withdrawn"],
      default: "active",
    },
    refundStatus: {
      type: String,
      enum: ["n/a", "pending", "processing", "completed", "partial_failure"],
      default: "n/a",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;

