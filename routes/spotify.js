import express from "express";
import { spotifyToken, verifyToken } from "../middleware/verification.js";
import { generateAuthURI, getAccessAndRefreshToken, getArtistData, getProfile } from "../controllers/spotify.js";
import { verify } from "crypto";
const router = express.Router();

router.get("/generate", generateAuthURI);
router.post("/access",[verifyToken], getAccessAndRefreshToken);
router.get("/artist", [spotifyToken], getArtistData);
router.get("/profile", [verifyToken, spotifyToken], getProfile);

export default router;