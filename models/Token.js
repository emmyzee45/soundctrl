import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  rToken: {
    type: String,
    default: "",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {timestamps: true});

export default mongoose.model("Token", tokenSchema);