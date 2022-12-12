import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import multer from "multer";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { register } from "./controllers/authController.js";
import authRouter from "./routes/authRouter.js";
import authorize from "./middleware/authorize.js";
import userRouter from "./routes/userRoutes.js";
import { createPost } from "./controllers/postsController.js";
import postsRouter from "./routes/postRouter.js";
import { users, posts } from "./data/index.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

// configuration
// below 2 lines are only for "type": "module" confiuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
dotenv.config();
const server = express();
server.use(express.json());
server.use(helmet());
server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
server.use(morgan("common"));
server.use(bodyParser.json({ limit: "30mb", extended: true }));
server.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
server.use(cors());
server.use("/assets", express.static(path.join(__dirname, "public/assets")));

// file storage
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, res, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// this routes is alone here, just cuz it uses the upload function above
server.post("/auth/register", upload.single("picture"), register);
server.post("/posts", authorize, upload.single("picture"), createPost);

// ROUTES
server.use("/auth", authRouter);
server.use("/users", authorize, userRouter);
server.use("/posts", authorize, postsRouter);

// mongo db connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("mongo db connected");

    // ALREADY RAN ONCE JUST TO INSERT THE DUMMY DATA IN.
    // await Post.insertMany(posts);
    // await User.insertMany(users);
    server.listen(process.env.PORT, () =>
      console.log(`server listening at: ${process.env.PORT}`)
    );
  })
  .catch((error) => console.log("db connection failed\n", error));
