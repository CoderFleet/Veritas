import { model, Schema, InferSchemaType, Document } from 'mongoose';
import jwt, { SignOptions } from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String
        }
    }
)

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    return next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    const secret = process.env.ACCESS_TOKEN_SECRET as string;
    const expiry = process.env.ACCESS_TOKEN_EXPIRY as string;
    if (!secret || !expiry) throw new Error("Couldn't find ACCESS_TOKEN_SECRET");

    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    };

    const options: SignOptions = {
        expiresIn: expiry as any,
    };

    return jwt.sign(payload, secret, options);
};

userSchema.methods.generateRefreshToken = function () {
    const secret = process.env.REFRESH_TOKEN_SECRET as string;
    const expiry = process.env.REFRESH_TOKEN_EXPIRY as string;
    if (!secret || !expiry) throw new Error("Couldn't find REFRESH_TOKEN_SECRET");

    const payload = {
        _id: this._id,
    };

    const options: SignOptions = {
        expiresIn: expiry as any,
    };

    return jwt.sign(payload, secret, options);
};

type UserType = InferSchemaType<typeof userSchema>

export interface IUser extends UserType {
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

type IUserDocument = IUser & Document;

export const userModel = model<IUserDocument>("User", userSchema);