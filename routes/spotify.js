import express from "express";
import { spotifyToken, verifyToken } from "../middleware/verification.js";
import { generateAuthURI, getAccessAndRefreshToken, getArtistData, getArtistTopTrack, getProfile, getUserPlaylist, getUserTopTracks } from "../controllers/spotify.js";
import { verify } from "crypto";
const router = express.Router();

router.get("/generate", generateAuthURI);
router.post("/access", getAccessAndRefreshToken);
router.get("/artist", [verifyToken,spotifyToken], getArtistData);
router.get("/playlists", [verifyToken, spotifyToken], getUserPlaylist);
router.get("/top-tracks", [verifyToken, spotifyToken], getUserTopTracks);
router.get("/artist-top-tracks/:artistId", [verifyToken, spotifyToken], getArtistTopTrack);
router.get("/profile", [verifyToken, spotifyToken], getProfile);

export default router;