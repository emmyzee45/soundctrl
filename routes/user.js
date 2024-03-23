import express from "express";
import { deleteUser, getAllArtist, getAllFans, getSingleUser, subscribe, updateUser } from "../controllers/user.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/:id", verifyToken, subscribe);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/artist", getAllArtist);
router.get("/fans", getAllFans);
router.get("/:id", verifyToken, getSingleUser);

export default router;