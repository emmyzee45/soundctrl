import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: false,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
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
  loginPlatform: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false,
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
    type: Array,
    // default: 0,
  },
  points: {
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
  spotify: {
    type: String,
    required: false,
  },
  tiktok: {
    type: String,
    required: false,
  },
  birthday: {
    type: String,
    required: false,
  },
  newsLetter: {
    type: Boolean,
    default: false
  }

},{
  timestamps:true
});

export default mongoose.model("User", userSchema)