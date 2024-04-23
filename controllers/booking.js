import createError from "../utils/createError.js";
import Ticket from "../models/Ticket.js";
import { google } from "googleapis";
import dayjs from "dayjs";
import { v4 } from "uuid";
import User from "../models/User.js";


export const createTicket = async (req, res, next) => {
  const calendar = google.calendar({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY
  })
 
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT
  );
  oauth2Client.setCredentials(req.body.accessToken)

  try {
    calendar.events.insert({
      calendarId: "primary",
      auth: oauth2Client,
      conferenceDataVersion: 1,
      requestBody: {
        summary: "Meeting with a fan",
        description: "Booking event created in sound-control to hagout with a fan",
        start: {
          dateTime: dayjs(req.body.start, "MM-DD-YYYY HH:mm").toISOString(),
          timeZone: "America/Los_Angeles"
        },
        end: {
          dateTime: dayjs(req.body.end, "MM-DD-YYYY HH:mm").toISOString(),
          timeZone: 'America/Los_Angeles'
        },
        conferenceData: {
         createRequest: {
          requestId: v4()
         }
        },
        sendNotifications: true
      }
    }, async(err, event) => {
      if(err) {
        console.log(err)
      } else {
        const newTicket = new Ticket({
          artistId: req.userId,
          time: req.body.time,
          // date: event.data.start.dateTime,
          date: req.body.date,
          link: event.data.hangoutLink,
          meetingId: event.data.id,
          // price: req.body.price,
        });
        const savedTicket = await newTicket.save();
    
        // res.status(201).send(savedTicket);
        res.status(200).json(savedTicket)
      }
    })

  } catch (err) {
    next(err);
  }
};

// update tickets by artist
export const updateTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.findByIdAndUpdate(req.params.id, req.body, {new: true});
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
    const artists = await User.find({ isArtist: true });
    const result = mergeTwoArray(artists, tickets);

    res.status(200).send(result);
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


function mergeTwoArray(artists, bookings) {
  let mergeArray = [];

  artists.forEach((user) => {

    bookings.forEach(obj => {
      if(user._id.toString() === obj.artistId.toString()) {
        mergeArray.push({...obj._doc, username: user.username })
      }
    })
  })

  return mergeArray;
}