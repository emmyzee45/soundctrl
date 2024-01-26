import express from "express";
import { createTicket, deleteTicket, getTickets, getTicketsByArtist, updateTickets } from "../controllers/booking.js";
import { verifyArtist, verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", [verifyToken, verifyArtist], createTicket);
router.put("/:id", [verifyToken, verifyArtist], updateTickets);
router.delete("/:id", [verifyToken, verifyArtist], deleteTicket);
router.get("/:id", getTicketsByArtist);
router.get("/", getTickets);

export default router;