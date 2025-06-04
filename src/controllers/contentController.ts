import { NextFunction, Request, Response } from "express";
import { ContentValidationSchema } from "../utils/zodSchemas";
import { Content } from "../models/contentModel";

const postContent = async (req: Request, res: Response, next: NextFunction) => {
    const result = ContentValidationSchema.safeParse(req.body);

    if (!result.success) {
        console.log(result.error);
        return res.status(400).json(result.error.flatten().fieldErrors);
    }

    const content = await Content.create({
        title: result.data.title,
        link: result.data.link,
        tags: result.data.tags,
        type: result.data.type,
        userId: req.userId
    });

    return res.status(201).json({
        statusCode: 201,
        data: content,
        message: "Success",
        success: true
    });
}