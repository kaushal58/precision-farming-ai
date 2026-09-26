import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';

export default function CropsPage() {
  const [crops, setCrops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', variety: '', area: 1 });

  const load = () => api.get('/crops').then(({ data }) => setCrops(data.crops || []));

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await api.post('/crops', form);
    toast.success('Crop added');
    setShowForm(false);
    load();
  };

  return (
    <div className="page-container">
      <PageHeader
        title="My Crops"
        description="Manage crops and track health scores"
        action={
          <button type="button" onClick={() => setShowForm(!showForm)} className="btn-primary !py-2">
            <Plus className="w-4 h-4" /> Add Crop
          </button>
        }
      />
      {showForm && (
        <form onSubmit={add} className="glass-card mb-6 grid sm:grid-cols-4 gap-4">
          <input className="input-field" placeholder="Crop name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input-field" placeholder="Variety" value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} />
          <input type="number" className="input-field" placeholder="Area" value={form.area} onChange={(e) => setForm({ ...form, area: +e.target.value })} />
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((c, i) => (
          <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="glass-card">
            <Sprout className="w-8 h-8 text-brand-500 mb-3" />
            <h3 className="font-bold text-lg">{c.name}</h3>
            <p className="text-sm text-slate-500">{c.variety} · {c.area} acres</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Health</span><span>{c.healthScore}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${c.healthScore}%` }} />
              </div>
            </div>
            <span className="inline-block mt-3 text-xs px-2 py-1 rounded-full bg-brand-500/10 text-brand-600 capitalize">{c.status}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
