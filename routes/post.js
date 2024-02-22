import express from "express";
import { addPost, likes, getPost } from "../controllers/post.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

//create a Post
router.post("/", verifyToken, addPost)
router.put("/:id", verifyToken, addPost)
router.delete("/:id", verifyToken, addPost)
router.get("/find/:id", getPost)
router.put("/like/:id", likes)

export default router;
