import mongoose from "mongoose";

const { Schema } = mongoose;

const contributionSchema = new Schema(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    contributor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    contributorWallet: {
      type: String,
      required: true,
      trim: true,
    },
    transactionHash: {
      type: String,
      required: true,
      trim: true,
    },
    contributedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["funded", "refunded"],
      default: "funded",
    },
    refundTxId: {
      type: String,
      trim: true,
    },
    nftAssetId: {
      type: Number,
      default: null,
    },
    nftStatus: {
      type: String,
      enum: ["none", "minting", "issued", "failed"],
      default: "none",
    },
  },
  { timestamps: false }
);

const Contribution = mongoose.model("Contribution", contributionSchema);

export default Contribution;

