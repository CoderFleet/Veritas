import { NextFunction, Request, Response } from "express"
import { UserValidationSchema, SignInValidationSchema } from "../utils/zodSchemas";
import { userModel } from "../models/userModel";

// User Controller methods
// Todo directly send req.body in validation

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, username, email, password } = req.body;

        const result = UserValidationSchema.safeParse({ fullName, username, email, password });
        if (!result.success) {
            console.log(result.error);
            return res.status(400).json(result.error.flatten().fieldErrors);
        }

        const existedUser = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (existedUser) return res.status(409).json({ message: "User Already Exists with the credentials provided" });

        const user = await userModel.create({
            fullName,
            username,
            email,
            password,
        });

        // const { password, ...outputUser } = user.toObject();

        return res
            .status(201)
            .json({
                statusCode: 201,
                data: user,
                message: "Success",
                success: true
            });
    } catch (error) {
        next(error);
    }
}

const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;

        const result = SignInValidationSchema.safeParse({ email, username, password });

        if (!result.success) {
            console.log(result.error);
            return res.status(400).json(result.error.flatten().fieldErrors)
        }

        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist..." })
        }

        // @ts-ignore
        const valid = await user.isPasswordCorrect(password);
        if (!valid) return res.status(401).json({ messsage: "Invalid user credentials" });

        return res
            .status(200)
            .json({
                statusCode: 201,
                data: user,
                message: "Success",
                success: true
            });
    }
    catch (err) {
        next(err)
    }
}

export { signin, signup }