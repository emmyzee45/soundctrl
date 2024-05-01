import createError from "../utils/createError.js";
import Ticket from "../models/Ticket.js";
import { google } from "googleapis";
import User from "../models/User.js";

export const handleGoogleAuth = async(req, res) => {
    if(req.query.code) {
        try {
          console.log(req.query.code)
          const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT
        );
        const { tokens } = await oauth2Client.getToken(req.query.code);
        const user = await User.findByIdAndUpdate(req.userId, {refresh_token: tokens.refresh_token});
        console.log(user)
        console.log(tokens)
        oauth2Client.setCredentials(tokens)
        console.log(oauth2Client)
        res.status(200).json({msg: "Successful"})
      }catch(err) {
        console.log(err)
      }
    }
  }