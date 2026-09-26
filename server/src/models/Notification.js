import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['weather', 'disease', 'irrigation', 'pest', 'system'], required: true },
    title: String,
    message: String,
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    read: { type: Boolean, default: false },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
