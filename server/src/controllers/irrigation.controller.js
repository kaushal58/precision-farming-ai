import Prediction from '../models/Prediction.js';
import * as aiService from '../services/aiService.js';

export const predictIrrigation = async (req, res, next) => {
  try {
    const { soilMoisture, temperature, humidity, rainfall, cropType, area } = req.body;

    let result;
    try {
      result = await aiService.predictIrrigation({
        soil_moisture: soilMoisture,
        temperature,
        humidity,
        rainfall: rainfall || 0,
        crop_type: cropType || 'wheat',
      });
    } catch {
      const moisture = Number(soilMoisture) || 45;
      result = {
        water_liters: Math.max(0, (60 - moisture) * (area || 1) * 50),
        schedule: moisture < 40 ? 'Irrigate today early morning' : 'Irrigate in 2 days',
        risk_level: moisture < 30 ? 'high' : moisture < 45 ? 'medium' : 'low',
        recommendation: moisture < 40
          ? 'Soil moisture low — irrigate 25mm depth'
          : 'Moisture adequate — monitor daily',
        next_check_hours: 24,
      };
    }

    const prediction = await Prediction.create({
      userId: req.user._id,
      type: 'irrigation',
      input: req.body,
      result,
      cropId: req.body.cropId,
    });

    res.json({ success: true, prediction: result, id: prediction._id });
  } catch (err) {
    next(err);
  }
};

export const getIrrigationHistory = async (req, res, next) => {
  try {
    const predictions = await Prediction.find({ userId: req.user._id, type: 'irrigation' })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, predictions });
  } catch (err) {
    next(err);
  }
};
