import createError from "../utils/createError.js";
import Ticket from "../models/Ticket.js";

export const createTicket = async (req, res, next) => {
  const newTicket = new Ticket({
    artistId: req.userId,
    time: req.body.time,
    link: req.body.link,
    price: req.body.price,

  });
  try {
    const savedTicket = await newTicket.save();

    res.status(201).send(savedTicket);
  } catch (err) {
    next(err);
  }
};

// get tickets by artist
export const getTickets = async (req, res, next) => {
  try {
    const Tickets = await Ticket.find({ artistId: req.params.id });
    res.status(200).send(Tickets);
  } catch (err) {
    next(err);
  }
};

// delete ticket by artist
export const deleteTicket = async (req, res, next) => {
  try {
    const Tickets = await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).send(Tickets);
  } catch (err) {
    next(err);
  }
};
