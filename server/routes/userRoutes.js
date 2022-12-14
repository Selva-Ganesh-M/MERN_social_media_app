import express from "express";
import {
  getUser,
  getFriends,
  addRemoveFriends,
} from "../controllers/userController.js";

const userRouter = express.Router();

// READ_ROUTES
userRouter.get("/:_id", getUser);
userRouter.get("/:_id/friends", getFriends);

// UPDATE_ROUTES
userRouter.patch("/:_id/:friendId", addRemoveFriends);

export default userRouter;
