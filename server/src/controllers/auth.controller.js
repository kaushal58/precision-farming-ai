import crypto from 'crypto';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, farmName, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      farmName,
      role: role === 'admin' ? 'admin' : 'farmer',
    });

    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, farmName: user.farmName },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmName: user.farmName,
        language: user.language,
        location: user.location,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ success: true, message: 'If email exists, reset link sent' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();
    res.json({
      success: true,
      message: 'Password reset initiated',
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.body.token).digest('hex');
    const user = await User.findOne({
      resetToken: hashed,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
