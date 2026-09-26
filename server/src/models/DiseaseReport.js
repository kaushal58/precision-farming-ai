import mongoose from 'mongoose';

const diseaseReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
    imageUrl: String,
    diseaseName: String,
    cropName: { type: String, default: 'General' },
    confidence: Number,
    severity: { type: String, enum: ['unknown', 'low', 'medium', 'high', 'critical'] },
    symptoms: String,
    treatment: String,
    chemicalTreatment: String,
    chemicalDosage: String,
    organicRemedy: String,
    prevention: [String],
    heatmapUrl: String,
    aiRaw: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('DiseaseReport', diseaseReportSchema);
