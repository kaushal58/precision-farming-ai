import { motion } from 'framer-motion';

export default function PageHeader({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
        {description && <p className="text-slate-500 mt-1">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
