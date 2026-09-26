import Crop from '../models/Crop.js';
import DiseaseReport from '../models/DiseaseReport.js';
import Prediction from '../models/Prediction.js';
import Notification from '../models/Notification.js';

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [crops, diseases, predictions, notifications] = await Promise.all([
      Crop.find({ userId }),
      DiseaseReport.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Prediction.find({ userId }).sort({ createdAt: -1 }).limit(10),
      Notification.find({ userId }).sort({ createdAt: -1 }).limit(10),
    ]);

    const avgHealth = crops.length
      ? Math.round(crops.reduce((s, c) => s + c.healthScore, 0) / crops.length)
      : 85;

    const irrigationPred = predictions.find((p) => p.type === 'irrigation');
    const pestPred = predictions.filter((p) => p.type === 'pest').length;

    const healthScore = Math.max(
      0,
      Math.min(100, avgHealth - diseases.filter((d) => d.severity === 'high').length * 5)
    );

    res.json({
      success: true,
      dashboard: {
        farmHealthScore: healthScore,
        totalCrops: crops.length,
        activeCrops: crops.filter((c) => c.status === 'growing').length,
        recentDiseases: diseases,
        irrigationStatus: irrigationPred?.result?.risk_level || 'low',
        pestAlerts: pestPred,
        notifications,
        analytics: {
          diseaseCount: await DiseaseReport.countDocuments({ userId }),
          predictionCount: predictions.length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
