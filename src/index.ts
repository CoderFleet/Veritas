import express, { Application, Request, Response } from "express";
import { signup, signin } from "./controllers/userController";
const app: Application = express();

app.use(express.json())

app.post("/api/v1/signup", signup)

app.post("/api/v1/signin", signin)

app.post("/api/v1/content",)

app.get("/api/v1/content", (req, res) => {

})

app.delete("/api/v1/content", (req, res) => {

})

app.post("/api/v1/brain/share", (req, res) => {

})

app.get("/api/v1/brain/:shareLink", (req, res) => {

})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});