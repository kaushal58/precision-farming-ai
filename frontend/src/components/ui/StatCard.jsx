import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'brand', delay = 0 }) {
  const colors = {
    brand: 'from-brand-500/20 to-brand-600/5 text-brand-600 dark:text-brand-400',
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-600',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-600',
    red: 'from-red-500/20 to-red-600/5 text-red-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-4`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </motion.div>
  );
}
