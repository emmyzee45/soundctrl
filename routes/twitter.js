import express from "express";
import { verifyToken } from "../middleware/verification.js"
import { requestAccessToken, requestToken } from "../controllers/twitter.js";

const router = express.Router();

router.get("/", verifyToken, requestToken);
router.post("/",verifyToken, requestAccessToken);

export default router;