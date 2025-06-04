import mongoose, { Schema, model } from "mongoose";
import { contentTypes } from "../utils/zodSchemas";
import { userModel } from "./userModel";

const contentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true
    },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    type: {
        type: String,
        enum: contentTypes,
        required: true
    },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
});

contentSchema.pre("save", async function (next) {
    const user = await userModel.findById(this.userId);
    if (!user) throw new Error('User does not exists');
    return next();
})

export const Content = model("Content", contentSchema);