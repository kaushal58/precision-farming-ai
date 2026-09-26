import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Leaf, Bug, Droplets, Cloud,
  Sprout, FileText, Settings, Shield, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/disease', icon: Leaf, label: 'Disease AI' },
  { to: '/app/pest', icon: Bug, label: 'Pest Detection' },
  { to: '/app/irrigation', icon: Droplets, label: 'Irrigation' },
  { to: '/app/weather', icon: Cloud, label: 'Weather' },
  { to: '/app/crops', icon: Sprout, label: 'My Crops' },
  { to: '/app/reports', icon: FileText, label: 'Reports' },
  { to: '/app/profile', icon: Settings, label: 'Profile' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center text-white font-bold"
        >
          🌾
        </motion.div>
        <motion.div>
          <p className="font-bold text-sm">AI Crop Guardian</p>
          <p className="text-xs text-slate-500">Precision Farming</p>
        </motion.div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/app/admin"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive ? 'bg-amber-500/15 text-amber-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <Shield className="w-5 h-5" />
            Admin Panel
          </NavLink>
        )}
      </nav>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass"
      >
        <Menu className="w-5 h-5" />
      </button>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}
      <aside
        className={`fixed left-0 top-0 h-full w-64 glass z-40 flex flex-col transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button type="button" onClick={() => setOpen(false)} className="lg:hidden absolute top-4 right-4">
          <X className="w-5 h-5" />
        </button>
        <NavContent />
      </aside>
    </>
  );
}
