import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import postRoute from "./routes/post.js";
import orderRoute from "./routes/order.js";
import bookingRoute from "./routes/booking.js";
import commentRoute from "./routes/comment.js";
import messageRoute from "./routes/message.js";
import waitlistRoute from "./routes/waitlist.js";
import conversationRoute from "./routes/conversation.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};
// { origin: "http://18.234.121.45", credentials: true }
// ["http://ec2-107-23-210-120.compute-1.amazonaws.com", "http://ec2-100-26-240-163.compute-1.amazonaws.com"]
app.use(cors({ origin: 
  [
  "http://ec2-100-26-240-163.compute-1.amazonaws.com",
  "http://ec2-18-234-107-143.compute-1.amazonaws.com",
  "http://localhost:3000"
], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/orders", orderRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/comments", commentRoute);
app.use("/api/messages", messageRoute);
app.use("/api/waitlists", waitlistRoute);
app.use("/api/conversations", conversationRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(process.env.PORT, () => {
  connect();
  console.log("Backend server is running!");
});
