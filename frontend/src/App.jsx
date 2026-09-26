import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import DiseasePage from './pages/dashboard/DiseasePage';
import PestPage from './pages/dashboard/PestPage';
import IrrigationPage from './pages/dashboard/IrrigationPage';
import WeatherPage from './pages/dashboard/WeatherPage';
import CropsPage from './pages/dashboard/CropsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import AdminPage from './pages/dashboard/AdminPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import Chatbot from './components/chat/Chatbot';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { token, fetchMe } = useAuthStore();
  const { theme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (token) fetchMe();
  }, [token, fetchMe]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="disease" element={<DiseasePage />} />
          <Route path="pest" element={<PestPage />} />
          <Route path="irrigation" element={<IrrigationPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="crops" element={<CropsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {token && <Chatbot />}
    </>
  );
}

export default App;
