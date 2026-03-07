import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdCampaigns: [
      {
        type: Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
    contributions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Contribution",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

