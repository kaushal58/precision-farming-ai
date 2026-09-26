import Notification from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, _id: { $in: req.body.ids || [req.params.id] } },
      { read: true }
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { read: true });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
