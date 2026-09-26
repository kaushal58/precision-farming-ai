import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    variety: String,
    plantedDate: Date,
    expectedHarvest: Date,
    area: { type: Number, default: 0 },
    areaUnit: { type: String, default: 'acres' },
    status: { type: String, enum: ['growing', 'harvested', 'failed'], default: 'growing' },
    healthScore: { type: Number, default: 85 },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Crop', cropSchema);
