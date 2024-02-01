import express from "express";
import { register, login, logout, forgotPassword, resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/forgetpassword", forgotPassword)
router.put("/reset/:token", resetPassword)

export default router;
