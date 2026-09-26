import * as weatherService from '../services/weatherService.js';

export const getWeather = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat) || req.user.location?.coordinates?.[1] || 23.02;
    const lon = parseFloat(req.query.lon) || req.user.location?.coordinates?.[0] || 72.57;

    const current = await weatherService.getCurrentWeather(lat, lon);
    const forecast = await weatherService.getForecast(lat, lon);
    const diseaseRisks = weatherService.getDiseaseWeatherRisk({
      humidity: current.humidity,
      temp: current.temp,
      rain: forecast?.[0]?.rain || 0,
    });

    const stormAlert = forecast?.some((f) => f.rain > 8)
      ? { active: true, message: 'Heavy rainfall expected — secure crops and drainage' }
      : null;

    await weatherService.logWeather(req.user._id, lat, lon, current, diseaseRisks);

    res.json({
      success: true,
      current,
      forecast,
      diseaseRisks,
      stormAlert,
    });
  } catch (err) {
    next(err);
  }
};
