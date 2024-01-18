import mongoose from "mongoose";

const WaitlistSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  dept: {
    type: String,
    required: false,
  },
  position: {
    type: String,
    required: false,
  },
  code: {
    type: String,
    required: false,
  },
  isIsued: {
    type: Boolean,
    default: false,
  }
}, {timestamps: true});

export default mongoose.model("Waitlist", WaitlistSchema);