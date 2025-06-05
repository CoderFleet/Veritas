import mongoose, { Schema, model } from "mongoose";

const linkSchema = new Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Link = model("Link", linkSchema);
