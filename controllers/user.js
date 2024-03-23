import Emails from "../models/Emails.js";
import User from "../models/User.js";
import createError from "../utils/createError.js";

export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted.");
};

export const getSingleUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
};

export const getAllArtist = async (req, res, next) => {
  try {
    const user = await User.find({isArtist: true});
    res.status(200).json(user);
  }catch(err) {
    next(err)
  }
};

export const getAllFans = async (req, res, next) => {
  try {
    const user = await User.find({isArtist: false});
    res.status(200).send(user);
  }catch(err) {
    next(err)
  }

};

// update user
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true});

    res.status(200).send(user);
  }catch(err) {
    next(err)
  }
};

// subscription user
export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { points: 10 },
      $addToSet: {subscribers: req.userId}
    });
    res.status(200).json("Subscription successfull.")
  } catch (err) {
    next(err);
  }
};

export const newsSubscription = async(req, res) => {
  const newEmail = new Emails(req.body);
  try {
    const email = await Emails.findOne(req.body);

    if(email) return res.status(400).json("Email already exist");

    await newEmail.save();
    res.status(200).json("email saved");
  }catch(err) {
    res.status(500).json(err);
  }
}

