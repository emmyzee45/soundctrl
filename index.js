import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
dotenv.config();

mongoose.connect("mongodb://localhost/soundctrl")

app.listen(process.env.PORT, () => {
    console.log("Backend started")
})