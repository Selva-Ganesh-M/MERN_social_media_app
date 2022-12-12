import mongoose from "mongoose";
import User from "../models/User.js";

const checkValidUser = async (_id) => {
  if (mongoose.isValidObjectId(_id)) {
    res.status(400);
    throw new Error("invalid user id.");
  }
  const user = await User.findById(_id);
  if (!user) {
    res.status(400);
    throw new Error("User not found.");
  }
  return user;
};

export const getUser = async (req, res) => {
  try {
    if (req.params._id !== req.user._id) {
      res.status(403);
      throw new Error("authorized user id not matched with the id on url.");
    }
    res.status(200).json(req.user);
  } catch (e) {
    res.status(res.statusCode !== 200 ? res.statusCode : 500);
    res.json(e.message);
  }
};

export const getFriends = async (req, res) => {
  try {
    if (req.params._id !== req.user._id) {
      res.status(403);
      throw new Error("authorized user id not matched with the id on url.");
    }
    const user = req.user;
    const friends = await Promise.all(
      user.friends.map((friend) => {
        const verifiedFriend = checkValidUser(friend._id);
        const { _id, firstname, lastname, occupation, locaiton, picturePath } =
          verifiedFriend;
        return { _id, firstname, lastname, occupation, locaiton, picturePath };
      })
    );
    res.status(200).json(friends);
  } catch (e) {
    res.status(res.statusCode !== 200 ? res.statusCode : 500);
    res.json(e.message);
  }
};

export const addRemoveFriends = async (req, res) => {
  const { _id, friendId } = req.params;
  try {
    const user = await mongoose.findById(_id);
    const friend = await checkValidUser(friendId);
    if (user.friends.includes(friend._id)) {
      user.friends.filter((person) => person._id != friend._id);
      friend.friends.filter((person) => person._id != user._id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(user._id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((friend) => {
        friend = checkValidUser(friend._id);
        const { _id, firstname, lastname, occupation, locaiton, picturePath } =
          friend;
        return { _id, firstname, lastname, occupation, locaiton, picturePath };
      })
    );
    res.status(200).json(friends);
  } catch (e) {
    res.status(res.statusCode !== 200 ? res.statusCode : 500);
    res.json(e.message);
  }
};
