import express from "express";
import { confirmCode, createWaitlist, deleteWaitlist, getWaitlists, sendCode } from "../controllers/waitlist.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", createWaitlist);
router.delete("/:id", verifyToken, deleteWaitlist);
router.get("/", getWaitlists);
router.post("/sendcode", verifyToken, sendCode);
router.post("/:code", confirmCode);

export default router;