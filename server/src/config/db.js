import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_crop_guardian';
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
