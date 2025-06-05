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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.signin = void 0;
const zodSchemas_1 = require("../utils/zodSchemas");
const userModel_1 = require("../models/userModel");
const generateAccessRefreshTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.userModel.findById(userId);
        if (!user)
            throw new Error("User not found...");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        yield user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (err) {
        throw new Error("Something went wrong while generating refresh and access token");
    }
});
// User Controller methods
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = zodSchemas_1.UserValidationSchema.safeParse(req.body);
        if (!result.success) {
            console.log(result.error);
            return res.status(400).json(result.error.flatten().fieldErrors);
        }
        const existedUser = yield userModel_1.userModel.findOne({
            $or: [{ username: result.data.username }, { email: result.data.email }],
        });
        if (existedUser)
            return res
                .status(409)
                .json({ message: "User Already Exists with the credentials provided" });
        const user = yield userModel_1.userModel.create({
            fullName: result.data.fullName,
            username: result.data.username,
            email: result.data.email,
            password: result.data.password,
        });
        const { accessToken, refreshToken } = yield generateAccessRefreshTokens(user._id);
        const _a = user.toObject(), { password } = _a, outputUser = __rest(_a, ["password"]);
        outputUser.refreshToken = null;
        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
            statusCode: 201,
            data: outputUser,
            message: "Success",
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = zodSchemas_1.SignInValidationSchema.safeParse(req.body);
        if (!result.success) {
            console.log(result.error);
            return res.status(400).json(result.error.flatten().fieldErrors);
        }
        const user = yield userModel_1.userModel.findOne({
            $or: [{ username: result.data.username }, { email: result.data.email }],
        });
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist..." });
        }
        const valid = yield user.isPasswordCorrect(result.data.password);
        if (!valid)
            return res.status(401).json({ messsage: "Invalid user credentials" });
        const { accessToken, refreshToken } = yield generateAccessRefreshTokens(user._id);
        const _a = user.toObject(), { password } = _a, outputUser = __rest(_a, ["password"]);
        outputUser.refreshToken = null;
        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
            statusCode: 201,
            data: outputUser,
            message: "Success",
            success: true,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.signin = signin;
