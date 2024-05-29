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
  twitter_refresh_token: {
    type: String,
    required: false,
  },
  stripe_account_id: {
    type: String,
    required: false
  },
  google_refresh_token: {
    type: String,
    required: false
  },
  instagram_refresh_token: {
    type: String,
    required: false,
  },
  spotify_id: {
    type: String,
    required: false,
  },
  spotify_refresh_token: {
    type: String,
    required: false,
  },
  tiktok_refresh_token: {
    type: String,
    required: false,
  },
  apple: {
    type: String,
    required: false,
  },
  birthday: {
    type: String,
    required: false,
  },
  onboarding_complete: {
    type: Boolean, 
    default: false
  },
  newsLetter: {
    type: Boolean,
    default: false
  },
  earnings: {
    subscriptions: {
      type: Number,
      default: 0,
    },
    bookings: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0
    }
  }

},{
  timestamps:true
});

export default mongoose.model("User", userSchema)