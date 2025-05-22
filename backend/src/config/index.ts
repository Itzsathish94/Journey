import dotenv from 'dotenv';

dotenv.config();

export const config = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mock-interview',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'your-client-id',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'your-client-secret',
  EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your-email-password',
};