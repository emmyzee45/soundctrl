import createError from "../utils/createError.js";
import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    artistId: req.isArtist ? req.userId : req.body.to,
    fanId: req.isArtist ? req.body.to : req.userId,
    readByArtist: req.isArtist,
    readByFan: !req.isArtist,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(201).send(savedConversation);
  } catch (err) {
    next(err);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          // readByArtist: true,
          // readByFan: true,
          ...(req.isArtist ? { readByArtist: true } : { readByFan: true }),
        },
      },
      { new: true }
    );

    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id });
    if (!conversation) return next(createError(404, "Not found!"));
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      req.isArtist ? { artistId: req.userId } : { fanId: req.userId }
    ).sort({ updatedAt: -1 });
    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};
