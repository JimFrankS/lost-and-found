import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        const readyState = mongoose.connection.readyState;

        if (readyState === 1) {
            return;
        } else if (readyState === 2) {
            await new Promise((resolve, reject) => {
                mongoose.connection.once('connected', resolve);
                mongoose.connection.once('error', reject);
                setTimeout(() => reject(new Error('Connection timeout')), 30000);
            });
            return;
        } else if (readyState === 3) {
            try {
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Disconnection timeout'));
                    }, 5000);

                    const onDisconnected = () => {
                        clearTimeout(timeout);
                        mongoose.connection.off('disconnected', onDisconnected);
                        mongoose.connection.off('error', onError);
                        resolve();
                    };

                    const onError = (error) => {
                        clearTimeout(timeout);
                        mongoose.connection.off('disconnected', onDisconnected);
                        mongoose.connection.off('error', onError);
                        reject(error);
                    };

                    mongoose.connection.once('disconnected', onDisconnected);
                    mongoose.connection.once('error', onError);
                });

                if (!ENV.MONGO_URI) {
                    throw new Error("MongoDB URI is not set. Define it in your environment, or set it in the .env file.");
                }
                await mongoose.connect(ENV.MONGO_URI);
                console.log("MongoDB reconnected successfully ✅");
                return;
            } catch (error) {
                console.log("Error waiting for disconnection:", error.message);
                throw error;
            }
        } else if (readyState === 0) {
            if (!ENV.MONGO_URI) {
                throw new Error("MongoDB URI is not set. Define it in your environment, or set it in the .env file.");
            }
            await mongoose.connect(ENV.MONGO_URI);
            console.log("MongoDB connected successfully ✅");
            return;
        }
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
        throw error; // let the caller decide what to do — don't kill the whole process
    }
};