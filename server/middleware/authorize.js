import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authorize = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401);
      throw new Error("unauthenticated user. Authorization token missing.");
    }
    const token = authorization.split(" ")[1];
    const authorizedUser = await jwt.verify(token, process.env.JWT_SECRET);
    if (!authorizedUser) {
      res.status(403);
      throw new Error(
        "Authorization failed. User doesn't have premission for this resources."
      );
    }
    const { _id } = authorizedUser;
    if (mongoose.isValidObjectId(_id)) {
      res.status(400);
      throw new Error("invalid user id.");
    }
    const user = await User.findById(_id);
    if (!user) {
      res.status(400);
      throw new Error("User not found.");
    }
    delete user.password;
    req.user = user;
    return next();
  } catch (e) {
    res.status(res.statusCode !== 200 ? res.statusCode : 500);
    res.json(e.message);
  }
};

export default authorize;
