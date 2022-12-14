import mongoose from "mongoose";
import User from "../models/User.js";

const checkValidUser = async (_id) => {
  _id = _id?.toString();
  if (!mongoose.isValidObjectId(_id)) {
    throw new Error("invalid user id.");
  }
  const user = await User.findById(_id);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

export const getUser = async (req, res) => {
  try {
    // console.log(req.params._id, req.user._id);
    // console.log(typeof req.params._id, typeof req.user._id);
    if (req.params._id !== req.user._id.toString()) {
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
    if (req.params._id !== req.user._id.toString()) {
      res.status(403);
      throw new Error("authorized user id not matched with the id on url.");
    }
    const user = req.user;
    const friends = await Promise.all(
      user.friends.map(async (friend) => {
        const verifiedFriend = await checkValidUser(friend.toString());
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
    let user = await User.findById(_id);
    let friend = await checkValidUser(friendId);
    friend = await User.findById(friend._id);
    if (user.friends.includes(friend._id)) {
      console.log("if");
      user.friends = user.friends.filter((_id) => _id != friend._id.toString());
      friend.friends = friend.friends.filter(
        (_id) => _id != user._id.toString()
      );
    } else {
      console.log("else");
      user.friends.push(friendId);
      friend.friends.push(user._id);
    }

    await user.save();
    await friend.save();

    // await (()=>{})()

    const friends = await Promise.all(
      user.friends.map(async (friend) => {
        friend = await checkValidUser(friend);
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
