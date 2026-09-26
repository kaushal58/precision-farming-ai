import { Sun, Moon, Bell, LogOut } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Topbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get('/notifications').then(({ data }) => {
      setUnread(data.notifications?.filter((n) => !n.read).length || 0);
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-slate-200/50 dark:border-slate-700/50 px-4 lg:px-8 py-4 flex items-center justify-between">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-lg font-semibold hidden sm:block">
          Welcome, {user?.name?.split(' ')[0] || 'Farmer'}
        </h1>
        <p className="text-xs text-slate-500">{user?.farmName || 'Your farm'}</p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button type="button" className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
        <button type="button" onClick={handleLogout} className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
