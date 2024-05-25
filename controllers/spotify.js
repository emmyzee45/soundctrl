import axios from "axios";
import User from "../models/User.js";
import querystring from "querystring";
import createError from "../utils/createError.js";

export const generateAuthURI = async(req, res, next) => {
    const type = req.query.type;
    const state = Math.random.toString(16);
    const scope = "user-read-private user-read-email"
    try {
        const url = "https://accounts.spotify.com/authorize?" + querystring.stringify({
            response_type: "code",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: `${
                type === "artist" ? process.env.ARTIST_PUBLIC_DOMAIN : process.env.FAN_PUBLIC_DOMAIN
            }/spotify`,
            state: state,
            show_dialog: true
        });

        res.status(200).json(url);
    }catch(err) {
        next(err);
        console.log(err);
    }
};

export const getAccessAndRefreshToken = async(req ,res, next) => {
    const type = req.query.type;
    const code = req.query.code;
    const state = req.query.state;

    try {
        if(state === null) {
            return next(createError(401, "state_mismatch"));
        }
        
        const result = await axios.post(
            "https://accounts.spotify.com/api/token", 
            { 
                code: code, 
                redirect_uri: `${
                    type === "artist" ? process.env.ARTIST_PUBLIC_DOMAIN : process.env.FAN_PUBLIC_DOMAIN
                }/spotify`,
                grant_type: "authorization_code" 
            },
            { headers: {  
                "Content-Type": "application/x-www-form-urlencoded", 
                "Authorization": `Basic ${
                    new Buffer.from(
                        process.env.SPOTIFY_CLIENT_ID+":"+process.env.SPOTIFY_CLIENT_SECRET
                    ).toString("base64")
                }`
            },
            json: true
            }
        );

        await User.findByIdAndUpdate(req.userId, { spotify: result.data.refresh_token });
        res.status(200).json(result.data.access_token);
    }catch(err) {
        console.log(err);
    }
}

export const getProfile = async(req, res, next) => {
    try {
        const result = await axios.get("https://api.spotify.com/v1/me", 
            { 
                headers: { "Authorization": `Bearer ${req.access_token }` }
            }
        );
        res.status(200).json(result.data);
    }catch(err) {
        next(err);
    }
}

export const getArtistData = async(req, res, next) => {
    try {
        const result = await axios.get(
            "https://api.spotify.com/v1/artists/2n4DcAtRMvfyRX3ljeC8Kp?si",
            { headers: { "Authorization": `Bearer ${req.access_token}` } }
        );
        console.log(result.data)
        res.status(200).json(result.data);
    }catch(err) {
        next(err);
    }
}