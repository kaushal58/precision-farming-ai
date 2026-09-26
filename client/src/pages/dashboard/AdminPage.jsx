import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import Skeleton from '../../components/ui/Skeleton';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => { setData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <motion.div className="page-container"><Skeleton className="h-64" /></motion.div>;

  const s = data?.stats || {};
  const chartData = (s.aiByType || []).map((x) => ({ type: x._id, count: x.count }));

  return (
    <div className="page-container">
      <PageHeader title="Admin Panel" description="System analytics, users, and AI request monitoring" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: s.users },
          { label: 'Farmers', value: s.farmers },
          { label: 'Disease Reports', value: s.diseases },
          { label: 'AI Predictions', value: s.predictions },
        ].map((item) => (
          <motion.div key={item.label} className="glass-card text-center">
            <p className="text-3xl font-bold">{item.value}</p>
            <p className="text-sm text-slate-500">{item.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold mb-4">AI Requests by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card max-h-80 overflow-y-auto">
          <h3 className="font-semibold mb-4">Recent Users</h3>
          {(data?.recentUsers || []).map((u) => (
            <div key={u._id} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
              <span>{u.name}</span>
              <span className="text-slate-500 capitalize">{u.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
