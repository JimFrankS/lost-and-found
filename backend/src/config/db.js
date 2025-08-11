import mongoose from 'mongoose';
import { ENV } from './env.js';
export const connectDB = async () => {
    try {

        if (!ENV.MONGO_URI) {
            console.error("MongoDB URI is not set. Define it in your environment, or set it in the .env file.");
            process.exit(1);
        } 
        await mongoose.connect(ENV.MONGO_URI)
        console.log("MongoDB connected successfully ✅"); 
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
        process.exit(1);
    };
};