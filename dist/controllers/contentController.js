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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.getContent = exports.postContent = void 0;
const zodSchemas_1 = require("../utils/zodSchemas");
const contentModel_1 = require("../models/contentModel");
const tagModel_1 = require("../models/tagModel");
const postContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = zodSchemas_1.ContentValidationSchema.safeParse(req.body);
        if (!result.success) {
            console.log(result.error);
            return res.status(400).json(result.error.flatten().fieldErrors);
        }
        for (let i = 0; i < result.data.tags.length; i++) {
            result.data.tags[i] = result.data.tags[i].toLowerCase();
        }
        const values = yield tagModel_1.Tag.find({
            value: { $in: result.data.tags },
        });
        result.data.tags = result.data.tags.filter((tag) => !values.some((value) => value.value === tag));
        const inserted = yield tagModel_1.Tag.insertMany(result.data.tags.map((tag) => ({ value: tag })));
        const content = yield contentModel_1.Content.create({
            title: result.data.title,
            link: result.data.link,
            tags: [...values, ...inserted].map((tag) => tag._id),
            type: result.data.type,
            userId: req.userId,
        });
        return res.status(201).json({
            statusCode: 201,
            data: content,
            message: "Success",
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.postContent = postContent;
const getContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contents = yield contentModel_1.Content.find({ userId: req.userId })
            .populate("tags", "value")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            statusCode: 200,
            data: contents,
            message: "Success",
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getContent = getContent;
const deleteContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const content = req.body.contentId;
        // Validate contentId
        // Assuming contentId is passed in the request body
        const validation = zodSchemas_1.DeleteContentParamsSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json(validation.error.flatten().fieldErrors);
        }
        if (!content) {
            return res.status(400).json({
                statusCode: 400,
                message: "Content ID is required",
                success: false,
            });
        }
        const deletedContent = yield contentModel_1.Content.findOneAndDelete({
            _id: content,
            userId: req.userId,
        });
        if (!deletedContent) {
            return res.status(404).json({
                statusCode: 404,
                message: "Content not found",
                success: false,
            });
        }
        return res.status(200).json({
            statusCode: 200,
            message: "Content deleted successfully",
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteContent = deleteContent;
