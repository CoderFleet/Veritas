import express, { Application } from "express";
import { signup, signin } from "./controllers/userController";
import connectDB from "./database/db";
import { getContent, postContent, deleteContent } from "./controllers/contentController";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware";
import { generateLink, getLinkData } from "./controllers/linkController";

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.post("/api/v1/signup", (req, res, next) => {
  Promise.resolve(signup(req, res, next)).catch(next);
});

app.post("/api/v1/signin", (req, res, next) => {
  Promise.resolve(signin(req, res, next)).catch(next);
});


app.post("/api/v1/content", authMiddleware, (req, res, next) => {
  Promise.resolve(postContent(req, res, next)).catch(next);
});

app.get("/api/v1/content", authMiddleware, (req, res, next) => {
  Promise.resolve(getContent(req, res, next)).catch(next);
});

app.delete("/api/v1/content", authMiddleware, (req, res, next) => {
    Promise.resolve(deleteContent(req, res, next)).catch(next);
});

app.post("/api/v1/brain/share", authMiddleware, (req, res, next) => {
    Promise.resolve(generateLink(req, res, next)).catch(next);
});

app.get("/api/v1/brain/:shareLink", authMiddleware, (req, res, next) => {
    Promise.resolve(getLinkData(req, res, next)).catch(next);
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("MONGO DB ki to .....", err);
  });
