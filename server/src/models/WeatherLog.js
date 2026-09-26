import mongoose from 'mongoose';

const weatherLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lat: Number,
    lon: Number,
    data: mongoose.Schema.Types.Mixed,
    alerts: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: true }
);

export default mongoose.model('WeatherLog', weatherLogSchema);
