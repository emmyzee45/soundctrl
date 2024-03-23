import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false
    }
},{timestamps: true});

export default mongoose.model("Email", EmailSchema);