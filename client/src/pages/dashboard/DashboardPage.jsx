import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Droplets, Bug, Cloud, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import Skeleton from '../../components/ui/Skeleton';

const chartData = [
  { day: 'Mon', health: 88 },
  { day: 'Tue', health: 90 },
  { day: 'Wed', health: 87 },
  { day: 'Thu', health: 92 },
  { day: 'Fri', health: 91 },
  { day: 'Sat', health: 89 },
  { day: 'Sun', health: 93 },
];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => {
      setData(data.dashboard);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  const d = data || {};

  return (
    <div className="page-container">
      <PageHeader title="Farm Health Dashboard" description="Real-time overview of your precision farming operations" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Farm Health Score" value={`${d.farmHealthScore || 85}%`} icon={Heart} color="brand" delay={0} />
        <StatCard title="Active Crops" value={d.activeCrops || 0} subtitle={`${d.totalCrops || 0} total`} icon={Droplets} color="blue" delay={0.1} />
        <StatCard title="Irrigation Risk" value={d.irrigationStatus || 'low'} icon={Droplets} color="amber" delay={0.2} />
        <StatCard title="Pest Alerts" value={d.pestAlerts || 0} icon={Bug} color="red" delay={0.3} />
      </div>

      <motion.div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card">
          <h3 className="font-semibold mb-4">Health Trend (7 days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12 }} />
              <Area type="monotone" dataKey="health" stroke="#22c55e" fill="url(#healthGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card space-y-4">
          <h3 className="font-semibold">Quick Actions</h3>
          {[
            { to: '/app/disease', label: 'Scan for Disease', icon: Heart },
            { to: '/app/irrigation', label: 'Irrigation Plan', icon: Droplets },
            { to: '/app/weather', label: 'Weather Alerts', icon: Cloud },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group">
              <span className="flex items-center gap-2 text-sm font-medium">
                <item.icon className="w-4 h-4 text-brand-500" /> {item.label}
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="glass-card">
          <h3 className="font-semibold mb-4">Recent Disease Reports</h3>
          {(d.recentDiseases || []).length === 0 ? (
            <p className="text-sm text-slate-500">No disease scans yet</p>
          ) : (
            d.recentDiseases.map((r) => (
              <div key={r._id} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm">{r.diseaseName}</span>
                <span className="text-xs text-slate-500">{r.confidence}% · {r.severity}</span>
              </div>
            ))
          )}
        </div>
        <div className="glass-card">
          <h3 className="font-semibold mb-4">Recent Notifications</h3>
          {(d.notifications || []).length === 0 ? (
            <p className="text-sm text-slate-500">No notifications yet</p>
          ) : (
            d.notifications.map((n) => (
              <div key={n._id} className="py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-slate-500">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
