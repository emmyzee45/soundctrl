import express from "express";
import { tiktokAuthorization } from "../controllers/tiktok.js";

const router = express.Router();

router.get("/", tiktokAuthorization);

export default router;