import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI ?? '',
  ARCJET_ENV: process.env.ARCJET_ENV || 'development',
  ARCJET_KEY: process.env.ARCJET_KEY || '',
};

if (!ENV.MONGO_URI) {
  throw new Error('MONGO_URI is required. Set in the .env file or environment variables.');
}