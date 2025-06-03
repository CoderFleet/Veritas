import { NextFunction, Request, Response } from "express"
import { z, ZodObject } from "zod";
import { userModel } from "../models/userModel";


// Zod Schemas
const User = z.object({
    fullName: z.string().min(3).max(100),
    username: z.string().min(3, "User name can't be that short").max(100),
    email: z.string().email(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must be no more than 100 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

const signInSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().min(3).max(100).optional(),
    password: z.string().min(8),
}).refine((data) => data.email || data.username, {
    message: 'Either email or password is required',
    path: ['username']
})

// User Controller methods
const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, username, email, password } = req.body;

        const result = User.safeParse({ fullName, username, email, password });
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

        const result = signInSchema.safeParse({ email, username, password });

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