import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent, confirm, bookingEarning, subsEarnings, transfer } from "../controllers/orders.js";

const router = express.Router();

// router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/booking", verifyToken, bookingEarning);
router.get("/subscription", verifyToken, subsEarnings);
router.post("/create-payment-intent", verifyToken, intent);
router.post("/transfer", verifyToken, transfer);
router.put("/confirm", verifyToken, confirm);

export default router;