"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("./controllers/userController");
const db_1 = __importDefault(require("./database/db"));
const contentController_1 = require("./controllers/contentController");
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const linkController_1 = require("./controllers/linkController");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.post("/api/v1/signup", (req, res, next) => {
    Promise.resolve((0, userController_1.signup)(req, res, next)).catch(next);
});
app.post("/api/v1/signin", (req, res, next) => {
    Promise.resolve((0, userController_1.signin)(req, res, next)).catch(next);
});
app.post("/api/v1/content", authMiddleware_1.authMiddleware, (req, res, next) => {
    Promise.resolve((0, contentController_1.postContent)(req, res, next)).catch(next);
});
app.get("/api/v1/content", authMiddleware_1.authMiddleware, (req, res, next) => {
    Promise.resolve((0, contentController_1.getContent)(req, res, next)).catch(next);
});
app.delete("/api/v1/content", authMiddleware_1.authMiddleware, (req, res, next) => {
    Promise.resolve((0, contentController_1.deleteContent)(req, res, next)).catch(next);
});
app.post("/api/v1/brain/share", authMiddleware_1.authMiddleware, (req, res, next) => {
    Promise.resolve((0, linkController_1.generateLink)(req, res, next)).catch(next);
});
app.get("/api/v1/brain/:shareLink", authMiddleware_1.authMiddleware, (req, res, next) => {
    Promise.resolve((0, linkController_1.getLinkData)(req, res, next)).catch(next);
});
(0, db_1.default)()
    .then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
})
    .catch((err) => {
    console.log("MONGO DB ki to .....", err);
});
