import express from "express";
import { deleteUser, getUser, subscribe, updateUser, getAllArtist, getAllFans } from "../controllers/user.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/:id", verifyToken, subscribe);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUser);
router.get("/artist",verifyToken, getAllArtist);
router.get("/fans",verifyToken, getAllFans);

export default router;