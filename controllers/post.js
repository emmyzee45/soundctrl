import Post from "../models/Post.js";
import createError from "../utils/createError.js";

export const addPost = async (req, res, next) => {
  const newPost = new Post({ userId: req.user.id, ...req.body });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found!"));
    if (req.user.id === post.userId) {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } else {
      return next(createError(403, "You can update only your Post!"));
    }
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found!"));
    if (req.user.id === post.userId) {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json("The Post has been deleted.");
    } else {
      return next(createError(403, "You can delete only your Post!"));
    }
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export const likes = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.userId)) {
          await post.updateOne({ $push: { likes: req.userId } });
          res.status(200).json("The post has been liked");
        } else {
          await post.updateOne({ $pull: { likes: req.userId } });
          res.status(200).json("The post has been disliked");
        }
      } catch (err) {
        res.status(500).json(err);
      }
}