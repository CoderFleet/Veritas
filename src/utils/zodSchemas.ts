import { z } from "zod";

const objectIDRegex = /^[0-9a-fA-F]{24}$/;

export const UserValidationSchema = z.object({
  fullName: z.string().min(3).max(100),
  username: z.string().min(3, "User name can't be that short").max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be no more than 100 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const SignInValidationSchema = z
  .object({
    email: z.string().email().optional(),
    username: z.string().min(3).max(100).optional(),
    password: z.string().min(8),
  })
  .refine((data) => data.email || data.username, {
    message: "Either email or password is required",
    path: ["username"],
  });

export const contentTypes = [
  "image",
  "video",
  "article",
  "audio",
  "documentation",
  "repository",
  "projectIdea",
] as const;

export const ContentValidationSchema = z.object({
  title: z.string().min(5).max(100),
  link: z.string().url(),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required...")
    .max(10, "Can't have that many tags...(Don't be a tagpaglu)"),
  type: z.enum(contentTypes),
});
