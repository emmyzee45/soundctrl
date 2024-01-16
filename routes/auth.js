import express from "express";
import { register, login, logout, forgotPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/forgotpassword", forgotPassword)

export default router;
