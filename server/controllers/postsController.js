import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = req.user;
    const post = new Post({
      userId,
      firstname: user.firstname,
      lastname: user.lastname,
      location: user.location,
      description,
      picturePath,
      userPicturePath: user.picturePath,
      likes: {},
      comments: [],
    });
    await post.save();
    const allPosts = await Post.find();
    res.status(401).json(allPosts);
  } catch (e) {
    res.status(res.statusCode !== 200 ? res.statusCode : 500);
    res.json(e.message);
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const allPosts = await Post.find();
    res.status(200).json(allPosts);
  } catch (e) {
    res.status(res.statusCode !== 200 ? res.statusCode : 500);
    res.json(e.message);
  }
};

export const getUserPosts = async (req, res) => {
  const { _id } = req.params;
  try {
    const userPosts = await Post.find({ userId: _id });
    res.status(200).json(userPosts);
  } catch (e) {
    res.status(404);
    res.json(e.message);
  }
};
export const likePost = async (req, res) => {
  try {
    const { _id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(_id);
    const isPresent = post.likes.get(userId);
    if (isPresent) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (e) {
    res.status(res.statusCode !== 200 ? res.statusCode : 500);
    res.json(e.message);
  }
};
