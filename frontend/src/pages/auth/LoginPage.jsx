import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('farmer@demo.com');
  const [password, setPassword] = useState('farmer123');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🌾</span>
          <span className="font-bold">AI Crop Guardian</span>
        </Link>
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-slate-500 text-sm mt-1">Demo account is prefilled: farmer@demo.com / farmer123</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="input-field mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="input-field mt-1" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Link to="/forgot-password" className="text-sm text-brand-600 hover:underline">Forgot password?</Link>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          No account? <Link to="/register" className="text-brand-600 font-medium hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
