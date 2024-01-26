import express from "express";
import {
  createMessage,
  deleteMessages,
  getMessages,
} from "../controllers/message.js";
import { verifyToken, verifyTokenAndAuthorization } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:id", verifyToken, getMessages);
router.delete("/:id", verifyTokenAndAuthorization, deleteMessages);

export default router;
