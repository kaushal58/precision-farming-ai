import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';

export default function IrrigationPage() {
  const [form, setForm] = useState({ soilMoisture: 38, temperature: 30, humidity: 55, rainfall: 0, cropType: 'wheat', area: 5 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/irrigation/predict', form);
      setResult(data.prediction);
      toast.success('Prediction ready');
    } catch {
      toast.error('Prediction failed');
    }
    setLoading(false);
  };

  const riskColors = { low: 'text-brand-500', medium: 'text-amber-500', high: 'text-red-500' };

  return (
    <div className="page-container">
      <PageHeader title="Smart Irrigation" description="ML-powered water recommendations based on soil and weather" />
      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={predict} className="glass-card space-y-4">
          {[
            { key: 'soilMoisture', label: 'Soil Moisture (%)', max: 100 },
            { key: 'temperature', label: 'Temperature (°C)', max: 50 },
            { key: 'humidity', label: 'Humidity (%)', max: 100 },
            { key: 'rainfall', label: 'Rainfall (mm)', max: 100 },
            { key: 'area', label: 'Area (acres)', max: 1000 },
          ].map(({ key, label, max }) => (
            <div key={key}>
              <label className="text-sm font-medium">{label}: {form[key]}</label>
              <input type="range" min="0" max={max} value={form[key]} onChange={(e) => setForm({ ...form, [key]: +e.target.value })} className="w-full mt-1 accent-brand-500" />
            </div>
          ))}
          <select className="input-field" value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })}>
            {['wheat', 'rice', 'corn', 'cotton', 'tomato'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Predicting...' : 'Get Recommendation'}</button>
        </form>
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card space-y-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-brand-500/10">
              <p className="text-4xl font-bold">{result.water_liters}L</p>
              <p className="text-slate-500 text-sm">Recommended water</p>
            </div>
            <p><strong>Schedule:</strong> {result.schedule}</p>
            <p><strong>Risk:</strong> <span className={`capitalize font-bold ${riskColors[result.risk_level]}`}>{result.risk_level}</span></p>
            <p className="text-sm text-slate-500">{result.recommendation}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
