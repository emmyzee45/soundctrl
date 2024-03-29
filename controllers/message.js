import createError from "../utils/createError.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const createMessage = async (req, res, next) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });
  try {
    const savedMessage = await newMessage.save();
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readByArtist: req.isArtist,
          readByFan: !req.isArtist,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};

export const deleteMessages = async (req, res, next) => {
  try {
    const messages = await Message.findByIdAndDelete(req.params.id );
    res.status(200).send("Deleted!");
  } catch (err) {
    next(err);
  }
};
