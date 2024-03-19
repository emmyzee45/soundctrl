import express from "express";
import { register, login, logout, forgotPassword, resetPassword, socialAuth } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/login/social", socialAuth)
router.post("/logout", logout)
router.post("/forgot-password", forgotPassword)
router.put("/reset/:token", resetPassword)

export default router;
