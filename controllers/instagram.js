import axios from "axios";
import FormData from "form-data";
import User from "../models/User.js";

let url = `https://api.instagram.com/oauth`;

export const intagramAuthorizeUri = async(req,res, next) => {
    const type = req.query.type
    try {
        url += `/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}`;
        url += `&redirect_uri=${
            type === "artist" ? process.env.ARTIST_PUBLIC_DOMAIN : process.env.FAN_PUBLIC_DOMAIN
        }/instagram`;
        url += `&scope=user_profile,user_media&response_type=code`;

        res.status(200).json(url);
    }catch(err) {
        console.log(err);
        next(err);
    }
};

export const getInstagramAccessToken = async(req, res, next) => {
    const { type, code } = req.query;

    try {
        const form = new FormData();
        form.append("client_id", process.env.INSTAGRAM_CLIENT_ID);
        form.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET);
        form.append("grant_type", "authorization_code");
        form.append("redirect_uri", `${
            type === "artist" ? process.env.ARTIST_PUBLIC_DOMAIN : process.env.FAN_PUBLIC_DOMAIN
        }/instagram`);
        form.append("code", code);
    
        const result = await axios.post(`${url}/access_token`, form, {
            headers: form.getHeaders()
        });

        const user = await User.findByIdAndUpdate(req.userId, 
            { instagram_refresh_token: result.data.access_token }, 
            { new: true }
        )

        const { password, ...userInfo } = user._doc;
        res.status(200).json(userInfo);

    }catch(err) {
        console.log(err);
        next(err);
    }
}

