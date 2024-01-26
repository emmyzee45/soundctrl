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

// update tickets by artist
export const updateTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.findByAndUpdate(req.params.id, req.body, {new: true});
    if(!tickets) return next(createError(404, "Not found!"));

    res.status(200).send(tickets);
  } catch (err) {
    next(err);
  }
};

// get tickets by artist
export const getTicketsByArtist = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ artistId: req.params.id });
    if(!tickets) return next(createError(404, "Not found!"))
    res.status(200).send(tickets);
  } catch (err) {
    next(err);
  }
};

// get all tickets
export const getTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).send(tickets);
  } catch (err) {
    next(err);
  }
};

// delete ticket by artist
export const deleteTicket = async (req, res, next) => {
  try {
    const tickets = await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).send(tickets);
  } catch (err) {
    next(err);
  }
};
