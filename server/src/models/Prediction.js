import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['irrigation', 'pest', 'weather_risk'],
      required: true,
    },
    input: mongoose.Schema.Types.Mixed,
    result: mongoose.Schema.Types.Mixed,
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  },
  { timestamps: true }
);

export default mongoose.model('Prediction', predictionSchema);
