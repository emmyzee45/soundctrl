import express from "express";
import { completeOnboarding, createStripeAccount, getAccountDetails, payout, generateCharge } from "../controllers/stripe.js";
import { verifyArtist, verifyToken } from "../middleware/verification.js";

const router = express.Router();

router.post("/",[verifyToken, verifyArtist], createStripeAccount);
router.put("/", [verifyToken, verifyArtist], completeOnboarding);
router.get("/", [verifyToken, verifyArtist], getAccountDetails);
router.post("/payout", [verifyToken, verifyArtist], payout);
router.post("/:id", [verifyToken, verifyArtist], generateCharge);

export default router;