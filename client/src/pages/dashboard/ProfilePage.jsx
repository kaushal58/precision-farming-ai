import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import PageHeader from '../../components/ui/PageHeader';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    farmName: user?.farmName || '',
    language: user?.language || 'en',
  });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });

  const saveProfile = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/users/profile', form);
    updateUser(data.user);
    toast.success('Profile updated');
  };

  const savePassword = async (e) => {
    e.preventDefault();
    await api.put('/users/password', pw);
    toast.success('Password changed');
    setPw({ currentPassword: '', newPassword: '' });
  };

  return (
    <div className="page-container max-w-2xl">
      <PageHeader title="Profile Settings" />
      <form onSubmit={saveProfile} className="glass-card space-y-4 mb-8">
        <h3 className="font-semibold">Personal Info</h3>
        {Object.entries(form).map(([k, v]) => (
          <div key={k}>
            <label className="text-sm capitalize">{k === 'farmName' ? 'Farm Name' : k}</label>
            {k === 'language' ? (
              <select className="input-field mt-1" value={v} onChange={(e) => setForm({ ...form, [k]: e.target.value })}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="gu">Gujarati</option>
              </select>
            ) : (
              <input className="input-field mt-1" value={v} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            )}
          </div>
        ))}
        <button type="submit" className="btn-primary">Save Profile</button>
      </form>
      <form onSubmit={savePassword} className="glass-card space-y-4">
        <h3 className="font-semibold">Change Password</h3>
        <input type="password" className="input-field" placeholder="Current password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
        <input type="password" className="input-field" placeholder="New password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required minLength={6} />
        <button type="submit" className="btn-secondary">Update Password</button>
      </form>
    </div>
  );
}
