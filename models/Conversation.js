import mongoose from "mongoose";
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    artistId: {
      type: String,
      required: true,
    },
    fanId: {
      type: String,
      required: true,
    },
    readByArtist: {
      type: Boolean,
      default: false,
    },
    readByFan: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", ConversationSchema);
