import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
    phone: String,
    farmName: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
      address: String,
    },
    avatar: String,
    language: { type: String, default: 'en' },
    resetToken: String,
    resetTokenExpiry: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ 'location.coordinates': '2dsphere' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
