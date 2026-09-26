import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 flex"
    >
      <Sidebar />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col min-w-0 lg:ml-64"
      >
        <Topbar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </motion.div>
    </motion.div>
  );
}
