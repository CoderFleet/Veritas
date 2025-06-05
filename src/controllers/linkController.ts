import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { Link } from "../models/linkModel";
import { Content } from "../models/contentModel";
import { userModel } from "../models/userModel";
import {
  ShareLinkValidationSchema,
  ShareLinkParamsSchema,
} from "../utils/zodSchemas";

export const generateLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { share } = req.body;
  const result = ShareLinkValidationSchema.safeParse({ share });
  if (!result.success) {
    return res.status(400).json(result.error.flatten().fieldErrors);
  }

  if (share) {
    const existingLink = await Link.findOne({ userId: req.userId });

    if (existingLink) {
      return res.status(200).json({ hash: existingLink.hash });
    }

    const hash = crypto
      .createHash("sha256")
      .update(req.userId + Date.now().toString())
      .digest("hex");
    const newLink = await Link.create({
      hash,
      userId: req.userId,
    });

    return res.status(201).json({ hash: newLink.hash });
  } else if (share === false) {
    const existingLink = await Link.findOne({ userId: req.userId });

    if (!existingLink) {
      return res.status(404).json({ message: "No link found to delete" });
    }

    await Link.deleteOne({ userId: req.userId });
    return res.status(200).json({ message: "Link deleted successfully" });
  }
};

export const getLinkData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hash = req.params.shareLink;

  const result = ShareLinkParamsSchema.safeParse({ shareLink: hash });
  if (!result.success) {
    return res.status(400).json(result.error.flatten().fieldErrors);
  }

  const linkData = await Link.findOne({ hash });

  if (!linkData) {
    return res.status(404).json({ message: "Link not found" });
  }

  const content = await Content.find({ userId: linkData.userId }).populate(
    "userId",
    "name email username"
  );

  const user = await userModel
    .find({ _id: linkData.userId })
    .select("name email username");

  return res.status(200).json({
    content,
    user,
  });
};
