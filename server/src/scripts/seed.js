import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Crop from '../models/Crop.js';
import connectDB from '../config/db.js';

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Crop.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@aicropguardian.com',
    password: 'admin123',
    role: 'admin',
    farmName: 'HQ Operations',
  });

  const farmer = await User.create({
    name: 'Rajesh Patel',
    email: 'farmer@demo.com',
    password: 'farmer123',
    role: 'farmer',
    farmName: 'Green Valley Farm',
    phone: '+91 98765 43210',
    location: { coordinates: [72.57, 23.02], address: 'Gujarat, India' },
  });

  await Crop.insertMany([
    { userId: farmer._id, name: 'Wheat', variety: 'HD-3086', area: 5, healthScore: 88 },
    { userId: farmer._id, name: 'Cotton', variety: 'Bt Cotton', area: 3, healthScore: 82 },
    { userId: farmer._id, name: 'Tomato', variety: 'Hybrid', area: 1.5, healthScore: 75 },
  ]);

  console.log('Seed complete!');
  console.log('Admin: admin@aicropguardian.com / admin123');
  console.log('Farmer: farmer@demo.com / farmer123');
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
