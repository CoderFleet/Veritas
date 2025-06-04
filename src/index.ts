import express, { Application, Request, Response } from "express";
import { signup, signin } from "./controllers/userController";
import connectDB from "./database/db"
const app: Application = express();

app.use(express.json())
// @ts-ignore
app.post("/api/v1/signup", signup)

// @ts-ignore
app.post("/api/v1/signin", signin)

app.post("/api/v1/content", )

app.get("/api/v1/content", (req, res) => {

})

app.delete("/api/v1/content", (req, res) => {

})

app.post("/api/v1/brain/share", (req, res) => {

})

app.get("/api/v1/brain/:shareLink", (req, res) => {

})

connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
})
    .catch((err) => {
        console.log("MONGO DB ki to .....", err);
    })