import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import querystring from "querystring";
import createError from "../utils/createError.js";

export const generateAuthURI = async(req, res, next) => {
    const type = req.query.type;
    const state = Math.random.toString(16);
    const scope = "user-read-private user-read-email playlist-read-collaborative playlist-read-private user-top-read"
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
    const { state, type, code } = req.query;

    try {
        if(state === null) {
            return next(createError(401, "state_mismatch"));
        }
        const getTokens = await getAccessToken(code, type);
        const getUser = await getUserProfile(getTokens.access_token)

        const user = await User.findOne({email: getUser.email });

        if(user) {
            if(!user.spotify_id) {
                user.points = user.points + 300
            }
            user.spotify_refresh_token = getTokens.refresh_token;
            user.spotify_id = getUser.id;
            await user.save();

            const token = jwt.sign({
                id: user._id,
                isArtist: user.isArtist,
                email: user.email,
            }, process.env.JWT_KEY);

            const {password, ...info } = user._doc;
            // console.log(info)
            res.status(200).json({ token, userInfo: {...info }})
        } else {
            const newUser = new User({
                ...getUser,
                points: 300,
                spotify_id: getUser.id,
                spotify_refresh_token: getTokens.refresh_token
            });

            await newUser.save();

            const token = jwt.sign({
                id: newUser._id,
                email: newUser.email,
                isArtist: newUser.isArtist,
            }, process.env.JWT_KEY);
    
            const {password, ...info} = newUser._doc;

            res.status(200).json({ token, userInfo: {...info} });
        }
    }catch(err) {
        next(err);
    }
}

const getAccessToken = async(code, type) => {
    
    const res = await axios.post(
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

    return res.data;
}

const getUserProfile = async(token) => {
    
    const result = await axios.get("https://api.spotify.com/v1/me", 
        { 
            headers: { "Authorization": `Bearer ${ token }` }
        }
    );
    return result.data;
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

        res.status(200).json(result.data);
    }catch(err) {
        next(err);
    }
}

// Get Several Artists
export const getSeveralArtists = async(req, res, next) => {
    try{
        // Retrieve all artist in database
        const users = await User.find({ isArtist: true });
        // filter users with spotify ids
        const ids = await filterUserIds(users);

        const result = await axios.get(`https://api.spotify.com/v1/artists?ids=${ids}`,
            {
                headers: { "Authorization": `Bearer ${ req.access_token }`}
            }
        );
        res.status(200).json(result.data.artists);
    }catch(err) {
        next(err);
    }
};

function filterUserIds(users) {
    let str = "";
    users.forEach(user => {
        if(user.spotify_id) {
            str += `${user.spotify_id},`;
        }
    });

    return str;
}

// Endpoint to get user's top tracks
export const getUserTopTracks = async(req, res, next) => {
    try {
        const result = await axios.get(`https://api.spotify.com/v1/me/top/tracks`, {
            headers: {
                Authorization: `Bearer ${req.access_token}`,
            },
            params: {
                limit: 10,
                time_range: 'short_term',
            }
        });
        res.status(200).json(result.data);
    }catch(err) {
        next(err);
        console.log(err);
    }
}

// Endpoint to get user's playlists
export const getUserPlaylist = async(req,res, next) => {
    try {
        const result = await axios.get(`https://api.spotify.com/v1/me/playlists`, {
            headers: {
                Authorization: `Bearer ${req.access_token}`,
            },
            params: {
                limit: 10
            }
        });

        res.status(200).json(result.data);
    }catch(err) {
        console.log(err);
        next(err);
    }
};

// Endpoint for getting artist top tracks
export const getArtistTopTrack = async(req,res, next) => {
    const artistId = req.params.artistId;
    try {
        const result = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
            headers: {
                Authorization: `Bearer ${req.access_token}`,
            },
            params: {
                market: "US"
            }
        });

        res.status(200).json(result.data);
    }catch(err) {
        console.log(err);
        next(err);
    }
}

const getArtistTopTracks = async(artistId) => {
    // const artistId = req.params.artistId;
    try {
        const result = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
            headers: {
                Authorization: `Bearer ${req.access_token}`,
            },
            params: {
                market: "US"
            }
        });

        res.status(200).json(result.data);
    }catch(err) {
        console.log(err);
        next(err);
    }
}

async function updatePoints() {
    try {
        const artists = await User.find({ isArtist:  true });

        artists.forEach(async(artist) => {
            // get artist tracks

            // get followers
            const fans = await User.find({ $in: { subscribers: artist._id } });

            
        })
    }catch(err) {

    }
}