import express from "express";
import {
  createConversation,
  deleteSingleConversation,
  getConversations,
  getSingleConversation,
  updateConversation,
} from "../controllers/conversation.js";
import { verifyToken, verifyTokenAndAuthorization } from "../middleware/verification.js";

const router = express.Router();

router.get("/", verifyToken, getConversations);
router.post("/", verifyToken, createConversation);
router.get("/:id", verifyToken, getSingleConversation);
router.delete("/:id", verifyTokenAndAuthorization, deleteSingleConversation);
router.put("/:id", verifyTokenAndAuthorization, updateConversation);

export default router;
