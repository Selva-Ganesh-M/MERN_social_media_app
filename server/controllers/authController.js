import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    location,
    occupation,
    picturePath,
  } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashPassword,
      location,
      occupation,
      picturePath,
      viewedProfiles: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("user doesn't exist.");
    }
    const authentication = bcrypt.compare(password, user.password);
    if (!authentication) {
      res.status(400);
      throw new Error("invalid creadentials");
    }
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    delete user.password;
    res
      .status(201)
      .json({ message: "Login Successful", payload: { user, token } });
  } catch (e) {
    res.status(res.statusCode !== 200 ? res.statusCode : 500);
    res.json(e.message);
  }
};
