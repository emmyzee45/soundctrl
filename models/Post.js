import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
