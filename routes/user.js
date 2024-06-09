import express from "express";
import { addFavorite, addHated, deleteUser, getAllArtist, getAllFans, getSingleUser, newsSubscription, subscribe, updateUser } from "../controllers/user.js";
import { verifyToken } from "../middleware/verification.js";

const router = express.Router();

router.post("/news", newsSubscription)
router.post("/:id", verifyToken, subscribe);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/artist", getAllArtist);
router.get("/fans", getAllFans);
// router.put("/favorite/:id", verifyToken, addFavorite);
// router.put("/hated/:id", verifyToken, addHated);
router.get("/:id", verifyToken, getSingleUser);

export default router;