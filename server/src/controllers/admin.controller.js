import User from '../models/User.js';
import DiseaseReport from '../models/DiseaseReport.js';
import Prediction from '../models/Prediction.js';
import Notification from '../models/Notification.js';

export const getStats = async (req, res, next) => {
  try {
    const [users, farmers, admins, diseases, predictions, notifications] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'admin' }),
      DiseaseReport.countDocuments(),
      Prediction.countDocuments(),
      Notification.countDocuments(),
    ]);

    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(10);
    const recentDiseases = await DiseaseReport.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(10);
    const aiByType = await Prediction.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: { users, farmers, admins, diseases, predictions, notifications, aiByType },
      recentUsers,
      recentDiseases,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive, role: req.body.role },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
