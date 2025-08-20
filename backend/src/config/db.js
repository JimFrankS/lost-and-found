import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        // Mongoose connection states:
        // 0: disconnected
        // 1: connected
        // 2: connecting
        // 3: disconnecting
        
        const readyState = mongoose.connection.readyState;
        
        if (readyState === 1) {
            // Already connected, return immediately
            return;
        } else if (readyState === 2) {
            // Currently connecting, wait for connection to complete
            await new Promise((resolve, reject) => {
                mongoose.connection.once('connected', resolve);
                mongoose.connection.once('error', reject);
                // Set a timeout to prevent hanging indefinitely
                setTimeout(() => reject(new Error('Connection timeout')), 30000);
            });
            return;
        } else if (readyState === 3) {
            // Currently disconnecting, wait for disconnect then reconnect
            try {
                await new Promise((resolve, reject) => {
                    // Set up timeout to prevent hanging
                    const timeout = setTimeout(() => {
                        reject(new Error('Disconnection timeout'));
                    }, 5000);

                    // Listen for disconnected event
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
                
                // Now reconnect
                if (!ENV.MONGO_URI) {
                    console.error("MongoDB URI is not set. Define it in your environment, or set it in the .env file.");
                    process.exit(1);
                }
                await mongoose.connect(ENV.MONGO_URI);
                console.log("MongoDB reconnected successfully ✅");
                return;
            } catch (error) {
                console.log("Error waiting for disconnection:", error.message);
                throw error;
            }
        } else if (readyState === 0) {
            // Disconnected, initiate new connection
            if (!ENV.MONGO_URI) {
                console.error("MongoDB URI is not set. Define it in your environment, or set it in the .env file.");
                process.exit(1);
            }
            await mongoose.connect(ENV.MONGO_URI);
            console.log("MongoDB connected successfully ✅");
            return;
        }
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
        process.exit(1);
    };
};
