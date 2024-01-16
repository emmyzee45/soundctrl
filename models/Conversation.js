import mongoose from "mongoose";
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
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
      required: true,
    },
    readByFan: {
      type: Boolean,
      required: true,
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
