import express from "express";
import { verifyToken } from "../middleware/verification.js";
import { getInstagramAccessToken, intagramAuthorizeUri } from "../controllers/instagram.js";

const router = express.Router();

router.get("/", verifyToken, intagramAuthorizeUri);
router.post("/", verifyToken, getInstagramAccessToken);

export default router;