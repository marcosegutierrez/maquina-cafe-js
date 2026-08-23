import mongoose from "mongoose";
import config from '../../config.js';

const MONGO_URL = config.MONGO_URL;

const connectionString = MONGO_URL;

export const initMongoDB = async () => {
    await mongoose.connect(connectionString);
    console.log('DB connected');
}