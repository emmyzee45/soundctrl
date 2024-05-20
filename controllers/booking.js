import createError from "../utils/createError.js";
import Ticket from "../models/Ticket.js";
import { google } from "googleapis";
import dayjs from "dayjs";
import { v4 } from "uuid";
import User from "../models/User.js";
import axios from "axios";

const scopes = ['https://www.googleapis.com/auth/calendar'];

const auth2Client = function() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_REDIRECT,
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  return oauth2Client;
}

const authCalendar = function() {
  const calendar = google.calendar({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY
  });

  return calendar;
}

export const generateAuthUrl = async() => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT
  )

  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      uxMode: "popup",
    });

    return url
    // res.status(200).json(url);
  }catch(err){
    console.log(err)
  }
}

export const handleGoogleAuth = async(req, res) => {

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT
    );
    const { tokens } = await oauth2Client.getToken(req.query.code);
    await User.findByIdAndUpdate(req.userId, {refresh_token: tokens.refresh_token});
    res.status(200).json({msg: "Successful"})
  }catch(err) {
    console.log(err)
  }
}

export const createTicket = async (req, res, next) => {
  const calendar = google.calendar({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY
  })
  // console.log(req.body)
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT
  );
  try {
    const user = await User.findById(req.userId);
    if(!user.refresh_token){
      const url = await generateAuthUrl();
       return res.status(201).json(url);
    }
    await oauth2Client.setCredentials({
    refresh_token: user.refresh_token
    })

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

      } else {
        const newTicket = new Ticket({
          artistId: req.userId,
          time: req.body.time,
          date: req.body.date,
          link: event.data.hangoutLink,
          meetingId: event.data.id,
          interval: req.body.interval
        });
        const savedTicket = await newTicket.save();
    
        res.status(200).json(savedTicket)
      }
    })

  } catch (err) {
    next(err);
  }
};

export const updateCalendar = async(req, res) => {
  const calendar = google.calendar({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY
  })
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT
  )

  try{
    const user = await User.findById(req.body.artistId);
    await oauth2Client.setCredentials({
      refresh_token: user.refresh_token
    })

    calendar.events.patch({
      calendarId: "primary",
      eventId: req.body.meetingId,
      auth: oauth2Client,
      requestBody: {
        attendees: [
          { "email": req.body.email }
        ]
      }
    }, async(err, event) => {
      if(err) {
        console.log(err)
      } else {
        const updatedTicket = await Ticket.findByIdAndUpdate(
          req.params.id, { status: "book" }, { new: true }
        );
        res.status(200).json(updatedTicket);
      }
    })
   
  }catch(err) {
    next(err)
  }

}

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