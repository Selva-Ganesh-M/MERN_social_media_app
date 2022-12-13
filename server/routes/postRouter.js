import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controllers/postsController.js";

const postsRouter = express.Router();

// READ_ROUTES
postsRouter.get("/", getFeedPosts), postsRouter.get("/:userId", getUserPosts);

// UPDATE_ROUTES
postsRouter.patch("/:_id/like", likePost);

export default postsRouter;
