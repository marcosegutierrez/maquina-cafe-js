import { Schema, model } from "mongoose";
import { LOGIN_SECURITY } from "../../../config.js";

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
    },
    mailAttemptsAt: {
        type: Date,
        default: null
    },
    codeAttemptsAt: {
        type: Date,
        default: null
    }
})

UserSchema.methods.registerMailAttempt = function() {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        this.lockUntil = null;
        this.mailAttempts = 0;
    }
    this.mailAttempts++;
    if (this.mailAttempts >= LOGIN_SECURITY.MAIL_ATTEMPTS) {
        this.lockUntil = Date.now() + LOGIN_SECURITY.BLOCK_TIME_MS;
    }
    return this.save();
}

UserSchema.methods.registerCodeAttempt = function() {
    this.codeAttempts++;
    if (this.codeAttempts >= LOGIN_SECURITY.CODE_ATTEMPTS) {
        this.lockUntil = Date.now() + LOGIN_SECURITY.BLOCK_TIME_MS;
    }
    return this.save();
}

export const UserModel = model('user', UserSchema);