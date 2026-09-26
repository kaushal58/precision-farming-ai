import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', farmName: '', phone: '' });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🌾</span>
          <span className="font-bold">AI Crop Guardian</span>
        </Link>
        <h1 className="text-2xl font-bold">Create account</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {['name', 'email', 'password', 'farmName', 'phone'].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium capitalize">{field === 'farmName' ? 'Farm Name' : field}</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                className="input-field mt-1"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required={field !== 'phone'}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Have an account? <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
