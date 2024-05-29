export const tiktokAuthorization = async(req, res, next) => {
    try {
        let url = `https://www.tiktok.com/v2/auth/authorize/`;
        url += `?client_key=${process.env.TIKTOK_CLIENT_KEY}`;
        url += `&scope=user.info.basic&response_type=code`;
        url += `&redirect_uri=https://www.dev.artist.soundctrl.xyz`;
        
        res.status(200).json(url);
    }catch(err) {
        console.log(err);
        next(err);
    }
}