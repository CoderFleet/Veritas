import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userModel } from "../models/userModel";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) throw new Error("Cookies me Token Nahi hain...");

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    if (decoded) {
      const user = await userModel
        .findById((decoded as JwtPayload)._id)
        .select("-password -refreshToken");
      if (!user) throw new Error("User Not Found / Invalid Access");
      req.userId = user._id as string;
      next();
    } else {
      throw new Error("Invalid AccessToken... Log In again to continue");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Problem with AuthMiddleware");
  }
};
