import axios from "axios";
import qs from "qs";
import User from "../models/User.js";

// Generate url for authorization
export async function requestToken(req, res, next) {
    const type = req.query.type;
    try {
        const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_OAUTH2_CLIENT_ID}&redirect_uri=${type === "artist" ? process.env.ARTIST_PUBLIC_DOMAIN : process.env.FAN_PUBLIC_DOMAIN}/twitter&scope=tweet.read%20users.read%20follows.read%20offline.access%20tweet.write%20follows.write%20like.write%20like.read%20mute.read%20mute.write%20block.read%20block.write&state=state&code_challenge=challenge&code_challenge_method=plain`
        res.status(200).json(url);
    }catch(err) {
        next(err);
    }
}

// Request for Refresh and Acess token
export const requestAccessToken = async(req, res, next) => {
    const url = `https://api.twitter.com/2/oauth2/token`
    const { code, type } = req.query;
    try {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${
                new Buffer.from(
                    process.env.TWITTER_OAUTH2_CLIENT_ID+":"+process.env.TWITER_OAUTH2_CLIENT_SECRET
                ).toString('base64')}`
        }
        const data = qs.stringify({
            code: `${code}`,
            grant_type: 'authorization_code',
            redirect_uri: `${
                type === "artist"? process.env.ARTIST_PUBLIC_DOMAIN : process.env.FAN_PUBLIC_DOMAIN
            }/twitter`,
            code_verifier: 'challenge'
        });

        const result = await axios.post(url, data, { headers });
        
        await User.findByIdAndUpdate(req.userId, {
            twitter_refresh_token: result.data.refresh_token
        });
        
        // const dat = qs.stringify({
        //     refresh_token: `${result.data.refresh_token}`,
        //     grant_type: 'refresh_token',
        // });
        // const refreshToken = await axios.post(url, dat, { headers });

        res.status(200).json(result.data);
    }catch(err) {
        next(err);
    }
}