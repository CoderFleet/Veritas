import { Schema, model } from "mongoose";

const tagSchema = new Schema({
    value: {
        type: String,
        required: true,
        unique: true
    }
});

export const Tag = model("Tag", tagSchema)