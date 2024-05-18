import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  fanId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "user"
  },
  time: {
    type: String,
    required: true,
  },
  interval: {
    type: Number,
  },
  date:{
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  meetingId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: "prepared"
  },
}, {timestamps: true});

export default mongoose.model("Ticket", ticketSchema);