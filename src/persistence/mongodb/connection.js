import mongoose from "mongoose";
import config from '../../config.js';

const MONGO_URL = config.MONGO_URL;

const connectionString =  MONGO_URL;

export const initMongoDB = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log('DB connected');
    } catch (error) {
        throw new Error(error);
    }
}