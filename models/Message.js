import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "conversation",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  desc: {
    type: String,
    required: true,
  },
},{
  timestamps:true
});

export default mongoose.model("Message", MessageSchema)