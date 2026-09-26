import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import Skeleton from '../../components/ui/Skeleton';

export default function WeatherPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/weather').then(({ data }) => { setData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><Skeleton className="h-64" /></div>;

  const c = data?.current || {};
  const forecast = (data?.forecast || []).map((f) => ({
    time: new Date(f.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }),
    temp: Math.round(f.temp),
    rain: f.rain || 0,
  }));

  return (
    <div className="page-container">
      <PageHeader title="Weather Intelligence" description="Forecasts, storm alerts, and disease-risk weather analysis" />

      {data?.stormAlert?.active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <p className="text-sm">{data.stormAlert.message}</p>
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Cloud, label: 'Temperature', value: `${Math.round(c.temp)}°C`, sub: c.description },
          { icon: Droplets, label: 'Humidity', value: `${Math.round(c.humidity)}%` },
          { icon: Wind, label: 'Wind', value: `${c.windSpeed?.toFixed(1)} m/s` },
          { icon: Cloud, label: 'Feels Like', value: `${Math.round(c.feelsLike || c.temp)}°C` },
        ].map((card) => (
          <motion.div key={card.label} className="glass-card text-center">
            <card.icon className="w-8 h-8 mx-auto text-brand-500 mb-2" />
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-slate-500">{card.label}</p>
            {card.sub && <p className="text-xs capitalize mt-1">{card.sub}</p>}
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold mb-4">24h Forecast</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={forecast}>
              <XAxis dataKey="time" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="temp" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card">
          <h3 className="font-semibold mb-4">Disease Weather Risks</h3>
          {(data?.diseaseRisks || []).length === 0 ? (
            <p className="text-sm text-brand-600">No elevated risks today</p>
          ) : (
            data.diseaseRisks.map((r, i) => (
              <div key={i} className={`p-3 rounded-xl mb-2 ${r.level === 'high' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                <p className="text-sm font-medium capitalize">{r.level} risk</p>
                <p className="text-xs text-slate-500">{r.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
