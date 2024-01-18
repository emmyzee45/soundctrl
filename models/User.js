import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarImg: {
    type: String,
    required: false,
  },
  bannerImg: {
    type: String,
    required: false,
  },
  chatprofileImg: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  subscribedUsers: {
    type: Array,
  },
  subscribers: {
    type: Number,
    default: 0,
  },
  videos: {
    type: Array,
  },
  isArtist: {
    type: Boolean,
    default:false
  },
  twitter: {
    type: String,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },

},{
  timestamps:true
});

export default mongoose.model("User", userSchema)