import express from "express";
import { createTicket, deleteTicket, generateAuthUrl, getTickets, getTicketsByArtist, handleGoogleAuth, updateCalendar, updateTickets } from "../controllers/booking.js";
import { verifyArtist, verifyToken } from "../middleware/verification.js";

const router = express.Router();

router.post("/", [verifyToken, verifyArtist], createTicket);
router.put("/event/:id", [verifyToken], updateCalendar);
router.put("/:id", [verifyToken], updateTickets);
router.delete("/:id", [verifyToken, verifyArtist], deleteTicket);
router.get("/generate", generateAuthUrl);
router.get("/google",[verifyToken, verifyArtist], handleGoogleAuth);
router.get("/:id", getTicketsByArtist);
router.get("/", getTickets);

export default router;