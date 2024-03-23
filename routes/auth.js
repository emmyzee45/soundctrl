import express from "express";
import { register, login, logout, forgotPassword, resetPassword, socialAuth, verifyCode } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/login/social", socialAuth)
router.post("/logout", logout)
router.post("/forgot-password", forgotPassword)
router.post("/verification/:token", verifyCode);
router.put("/reset/:id", resetPassword)

export default router;
