"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkData = exports.generateLink = void 0;
const crypto_1 = __importDefault(require("crypto"));
const linkModel_1 = require("../models/linkModel");
const contentModel_1 = require("../models/contentModel");
const userModel_1 = require("../models/userModel");
const zodSchemas_1 = require("../utils/zodSchemas");
const generateLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    const result = zodSchemas_1.ShareLinkValidationSchema.safeParse({ share });
    if (!result.success) {
        return res.status(400).json(result.error.flatten().fieldErrors);
    }
    if (share) {
        const existingLink = yield linkModel_1.Link.findOne({ userId: req.userId });
        if (existingLink) {
            return res.status(200).json({ hash: existingLink.hash });
        }
        const hash = crypto_1.default
            .createHash("sha256")
            .update(req.userId + Date.now().toString())
            .digest("hex");
        const newLink = yield linkModel_1.Link.create({
            hash,
            userId: req.userId,
        });
        return res.status(201).json({ hash: newLink.hash });
    }
    else if (share === false) {
        const existingLink = yield linkModel_1.Link.findOne({ userId: req.userId });
        if (!existingLink) {
            return res.status(404).json({ message: "No link found to delete" });
        }
        yield linkModel_1.Link.deleteOne({ userId: req.userId });
        return res.status(200).json({ message: "Link deleted successfully" });
    }
});
exports.generateLink = generateLink;
const getLinkData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const result = zodSchemas_1.ShareLinkParamsSchema.safeParse({ shareLink: hash });
    if (!result.success) {
        return res.status(400).json(result.error.flatten().fieldErrors);
    }
    const linkData = yield linkModel_1.Link.findOne({ hash });
    if (!linkData) {
        return res.status(404).json({ message: "Link not found" });
    }
    const content = yield contentModel_1.Content.find({ userId: linkData.userId }).populate("userId", "name email username");
    const user = yield userModel_1.userModel
        .find({ _id: linkData.userId })
        .select("name email username");
    return res.status(200).json({
        content,
        user,
    });
});
exports.getLinkData = getLinkData;
