import { NextFunction, Request, Response } from "express"
import { UserValidationSchema, SignInValidationSchema } from "../utils/zodSchemas";
import { IUser, userModel } from "../models/userModel";

const generateAccessRefreshTokens = async (userId: any) => {
    try {
        const user = await userModel.findById(userId) as IUser;
        if (!user) throw new Error("User not found...")
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        // @ts-ignore
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (err) {
        throw new Error("Something went wrong while generating refresh and access token");
    }
};

// User Controller methods
const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = UserValidationSchema.safeParse(req.body);
        if (!result.success) {
            console.log(result.error);
            return res.status(400).json(result.error.flatten().fieldErrors);
        }

        const existedUser = await userModel.findOne({
            $or: [{ username: result.data.username, }, { email: result.data.email }]
        });

        if (existedUser) return res.status(409).json({ message: "User Already Exists with the credentials provided" });

        const user = await userModel.create({
            fullName: result.data.fullName,
            username: result.data.username,
            email: result.data.email,
            password: result.data.password,
        });

        const { accessToken, refreshToken } = await generateAccessRefreshTokens(user._id)
        const { password, ...outputUser } = user.toObject();

        outputUser.refreshToken = null;

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        }

        return res
            .status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
                statusCode: 201,
                data: outputUser,
                message: "Success",
                success: true
            });
    } catch (error) {
        next(error);
    }
}

const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = SignInValidationSchema.safeParse(req.body);

        if (!result.success) {
            console.log(result.error);
            return res.status(400).json(result.error.flatten().fieldErrors)
        }

        const user = await userModel.findOne({
            $or: [{ username: result.data.username }, { email: result.data.email }]
        })

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist..." })
        }

        const valid = await user.isPasswordCorrect(result.data.password);
        if (!valid) return res.status(401).json({ messsage: "Invalid user credentials" });

        const { accessToken, refreshToken } = await generateAccessRefreshTokens(user._id);
        const { password, ...outputUser } = user.toObject();

        outputUser.refreshToken = null;

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
                statusCode: 201,
                data: outputUser,
                message: "Success",
                success: true
            });
    }
    catch (err) {
        next(err)
    }
}

export { signin, signup }