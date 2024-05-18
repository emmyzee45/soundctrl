import User from "../models/User.js";
import Token from "../models/Token.js";
import createError from "../utils/createError.js";
import sendEmail from "../utils/sendMail.js";
import hashToken from "../utils/hashToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const user = await User.find({email: req.body.email});
    if(user.length) return res.status(400).json("Email already exist");

    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) return next(createError(404, "User not found!"));

    if (!user.password)
      return next(createError(400, "Wrong password or email!"));
    
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or email!"));

    const token = jwt.sign(
      {
        id: user._id,
        isArtist: user.isArtist,
        account_id: user.account_id
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;
    // res
    //   .cookie("accessToken", token, {
    //     httpOnly: true,
    //   })
    //   .status(200)
    //   .send(info);
    res.status(200).json({token, userInfo: {...info}});
  } catch (err) {
    next(err);
  }
};

export const socialAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        // loginService: ,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_KEY);
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
const user = await User.findOne({ email });

if (!user) {
  return res.status(404).json("No user with this email");
}

// Delete Token if it exists in DB
let token = await Token.findOne({ userId: user._id });
if (token) {
  await token.deleteOne();
}


 // Genrate 6 digit code
 const loginCode = Math.floor(1000 + Math.random() * 9000);

// Hash token and save
const hashedToken = hashToken(loginCode);
await new Token({
  userId: user._id,
  rToken: hashedToken,
  createdAt: Date.now(),
  expiresAt: Date.now() + 60 * (60 * 1000), // 60mins
}).save();


// Send Email
const subject = "Password Reset Request - AUTH:Z";
const send_to = user.email;
const sent_from = process.env.EMAIL_USER;
const reply_to = "noreply@simver.net";
const template = "forgetpassword";
const name = user. username;
const link = loginCode;

try {
  await sendEmail(
    subject,
    send_to,
    sent_from,
    reply_to,
    template,
    name,
    link
  );
  res.status(200).json({ message: "Password Reset Email Sent" });
} catch (error) {
  res.status(500).json("Email not sent, please try again");
}
};

// Token Verification
export const verifyCode = async(req, res) => {
  const token = req.params.token;

  try {
    const hashedToken = hashToken(token);
    const userToken = await Token.findOne({
      rToken: hashedToken,
      expiresAt: { $gt: Date.now() },
    });
  
    if (!userToken) {
      return res.status(404).json("Invalid or Expired Token");
    }
    // Find User
    const user = await User.findOne({ _id: userToken.userId });
  
    res.status(200).json(user._id);
  }catch(err) {
    res.status(500).json(err);
  }
}

// Reset Password
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  // Find User
 try{
  const user = await User.findOne({_id: req.params.id});
  const hash = bcrypt.hashSync(password, 5);

  // Now Reset password
  user.password = hash;
  await user.save();

  res.status(200).json({ message: "Password Reset Successful, please login" });
 } catch(err) {
  res.status(500).json(err);
 }
};
