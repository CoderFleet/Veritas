"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteContentParamsSchema = exports.ShareLinkParamsSchema = exports.ShareLinkValidationSchema = exports.ObjectIdValidationSchema = exports.ContentValidationSchema = exports.contentTypes = exports.SignInValidationSchema = exports.UserValidationSchema = void 0;
const zod_1 = require("zod");
const objectIDRegex = /^[0-9a-fA-F]{24}$/;
exports.UserValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3).max(100),
    username: zod_1.z.string().min(3, "User name can't be that short").max(100),
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must be no more than 100 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});
exports.SignInValidationSchema = zod_1.z
    .object({
    email: zod_1.z.string().email().optional(),
    username: zod_1.z.string().min(3).max(100).optional(),
    password: zod_1.z.string().min(8),
})
    .refine((data) => data.email || data.username, {
    message: "Either email or password is required",
    path: ["username"],
});
exports.contentTypes = [
    "image",
    "video",
    "article",
    "audio",
    "documentation",
    "repository",
    "projectIdea",
];
exports.ContentValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(100),
    link: zod_1.z.string().url(),
    tags: zod_1.z
        .array(zod_1.z.string())
        .min(1, "At least one tag is required...")
        .max(10, "Can't have that many tags...(Don't be a tagpaglu)"),
    type: zod_1.z.enum(exports.contentTypes),
});
exports.ObjectIdValidationSchema = zod_1.z.string().regex(objectIDRegex, {
    message: "Invalid ObjectId format",
});
exports.ShareLinkValidationSchema = zod_1.z.object({
    share: zod_1.z.boolean(),
});
exports.ShareLinkParamsSchema = zod_1.z.object({
    shareLink: zod_1.z.string().regex(objectIDRegex, {
        message: "Invalid share link format",
    }),
});
exports.DeleteContentParamsSchema = zod_1.z.object({
    contentId: zod_1.z.string().regex(objectIDRegex, {
        message: "Invalid content ID format",
    }),
});
