import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  time: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: false,
  },
  meetingId: {
    type: String,
    required: false,
  },
}, {timestamps: true});

export default mongoose.model("Ticket", ticketSchema);