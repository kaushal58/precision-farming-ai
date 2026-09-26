import axios from 'axios';
import WeatherLog from '../models/WeatherLog.js';

const API_KEY = process.env.OPENWEATHER_API_KEY;

export const getCurrentWeather = async (lat, lon) => {
  if (!API_KEY) {
    return getMockWeather(lat, lon);
  }
  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: { lat, lon, appid: API_KEY, units: 'metric' },
  });
  return normalizeWeather(data);
};

export const getForecast = async (lat, lon) => {
  if (!API_KEY) return getMockForecast();
  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: { lat, lon, appid: API_KEY, units: 'metric' },
  });
  return data.list?.slice(0, 8).map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    humidity: item.main.humidity,
    rain: item.rain?.['3h'] || 0,
    description: item.weather[0]?.description,
  }));
};

export const logWeather = async (userId, lat, lon, data, alerts = []) => {
  return WeatherLog.create({ userId, lat, lon, data, alerts });
};

const normalizeWeather = (data) => ({
  temp: data.main?.temp,
  feelsLike: data.main?.feels_like,
  humidity: data.main?.humidity,
  pressure: data.main?.pressure,
  windSpeed: data.wind?.speed,
  description: data.weather?.[0]?.description,
  icon: data.weather?.[0]?.icon,
  city: data.name,
  sunrise: data.sys?.sunrise,
  sunset: data.sys?.sunset,
});

const getMockWeather = (lat, lon) => ({
  temp: 28 + Math.random() * 5,
  feelsLike: 30,
  humidity: 55 + Math.random() * 20,
  pressure: 1013,
  windSpeed: 3.5,
  description: 'partly cloudy',
  icon: '02d',
  city: 'Farm Zone',
  lat,
  lon,
  mock: true,
});

const getMockForecast = () =>
  Array.from({ length: 8 }, (_, i) => ({
    dt: Date.now() / 1000 + i * 10800,
    temp: 26 + Math.random() * 6,
    humidity: 50 + Math.random() * 25,
    rain: Math.random() > 0.7 ? Math.random() * 5 : 0,
    description: ['clear sky', 'light rain', 'cloudy'][i % 3],
  }));

export const getDiseaseWeatherRisk = (weather) => {
  const risks = [];
  if (weather.humidity > 80) risks.push({ level: 'high', message: 'High humidity increases fungal disease risk' });
  if (weather.temp > 35) risks.push({ level: 'medium', message: 'Heat stress may affect crop health' });
  if (weather.rain > 10) risks.push({ level: 'medium', message: 'Heavy rainfall — monitor for blight' });
  return risks;
};
