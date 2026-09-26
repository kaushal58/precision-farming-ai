import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
      if (data.resetToken) toast(`Dev token: ${data.resetToken}`, { duration: 10000 });
    } catch {
      toast.error('Request failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-brand-950 p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md glass-card">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="email" className="input-field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" disabled={loading} className="btn-primary w-full">Send reset link</button>
        </form>
        <Link to="/login" className="block mt-4 text-center text-sm text-brand-600">Back to login</Link>
      </motion.div>
    </div>
  );
}
