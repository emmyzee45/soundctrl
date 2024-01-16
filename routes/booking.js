import express from "express";
import { createTicket, deleteTicket, getTickets } from "../controllers/booking.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createTicket);
router.delete("/:id", verifyToken, deleteTicket);
router.get("/:id", getTickets);

export default router;