import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  time: {
    type: Date,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
}, {timestamps: true});

export default mongoose.model("Ticket", ticketSchema);