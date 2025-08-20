import mongoose from 'mongoose';
import { ENV } from './env.js';
export const connectDB = async () => {
    try {
        // Mongoose connection states:
        // 0: disconnected
        // 1: connected
        // 2: connecting
        // 3: disconnecting
        const { readyState } = mongoose.connection;
        // If already connected, nothing to do
        if (readyState === 1) return;
        // If connecting, wait until connected before returning
        if (readyState === 2) {
            await new Promise((resolve, reject) => {
                mongoose.connection.once('connected', resolve);
                mongoose.connection.once('error', reject);
            });
            return;
        }
        // If disconnecting (3), fall through and attempt a fresh connect below.
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