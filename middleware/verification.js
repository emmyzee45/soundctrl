import jwt from "jsonwebtoken";
import User from "../models/User.js";
import createError from "../utils/createError.js";
import axios from "axios";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // const token = req.cookies.accessToken;
  if (!token) return next(createError(401,"You are not authenticated!"))

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return next(createError(403,"Token is not valid!"));
    req.userId = payload.id;
    req.isArtist = payload.isArtist;
    next() 
  });
};

export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.userId === req.params.id) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

export const verifyArtist = (req, res, next) => {
  if(!req.isArtist) {
    return next(createError(403, "Unauthorized"))
  }
  next()
};

export const spotifyToken = async(req, res, next) => {

  try {
    const user = await User.findById(req.userId);
    // console.log(user)
    if(!user?.spotify) return next(createError(401, "Not authenticated"));

    const result = await axios.post(
      `https://accounts.spotify.com/api/token`, {
        grant_type: "refresh_token",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        refresh_token: user.spotify
      },
      { headers: 
        { 
          "Content-Type": "application/x-www-form-urlencoded", 
          "Authorization": `Basic ${
            new Buffer.from(
              process.env.SPOTIFY_CLIENT_ID+":"+process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64")
          }` 
        }
      }
    );
    req.access_token = result.data.access_token;
    next();
  }catch(err) {
    next(err);
  }
};

export const spotifyClientToken = async(req, res, next) => {
  try {
    const result = await axios.post(
      `https://accounts.spotify.com/api/token`,
      { grant_type: "client_credentials" }, 
      {
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${
            new Buffer.from(process.env.SPOTIFY_CLIENT_ID+":"+process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
          }`}
      }
    );
      req.access_token = result.data.access_token;
      next();
  }catch(err) {
    res.status(500).json(err);
  }
}