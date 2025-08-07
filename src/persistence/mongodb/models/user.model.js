import { Schema, model } from "mongoose";

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

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
        default: getRandomArbitrary(100000,999999)
    }
})

export const UserModel = model('user', UserSchema);