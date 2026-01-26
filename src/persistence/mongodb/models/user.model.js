import { Schema, model } from "mongoose";

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
        type: Number
    },
    codeExpiresAt: {
        type: Date
    },
    codeAttempts: {
        type: Number,
        default: 0
    },
    mailAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    }
})

export const UserModel = model('user', UserSchema);