import { Schema, model } from "mongoose";
import { generateCodeValidator } from "../../../utils.js";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        default: generateCodeValidator()
    }
})

export const UserModel = model('user', UserSchema);