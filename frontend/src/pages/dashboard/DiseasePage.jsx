import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, History, Leaf, ShieldCheck, FlaskConical, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';

const TARGET_CROPS = [
  { id: 'tomato', name: 'Tomato', icon: '🍅' },
  { id: 'potato', name: 'Potato', icon: '🥔' },
  { id: 'corn', name: 'Corn', icon: '🌽' },
  { id: 'wheat', name: 'Wheat', icon: '🌾' },
  { id: 'auto', name: 'Auto-Detect', icon: '🔍' },
];

export default function DiseasePage() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const fileRef = useRef();

  useEffect(() => {
    api.get('/disease/history').then(({ data }) => setHistory(data.reports || []));
  }, [result]);

  const handleFile = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    analyze(file);
  };

  const analyze = async (file) => {
    setLoading(true);
    setError(null);
    const form = new FormData();
    form.append('image', file);
    form.append('crop', selectedCrop);

    try {
      const { data } = await api.post('/disease/analyze', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data.report);
      toast.success('Diagnosis complete');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Analysis failed';
      setError(message);
      setResult(null);
      toast.error(message);
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Precision Crop Disease AI"
        description="Focused high-accuracy diagnostic intelligence for Tomato, Potato, Corn, and Wheat"
      />

      {/* Crop Selector Toolbar */}
      <div className="mb-6 glass-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Select Target Crop</p>
            <p className="text-xs text-slate-500">Focusing on your crop eliminates false positives and gives precise dosages</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TARGET_CROPS.map((crop) => (
              <button
                key={crop.id}
                type="button"
                onClick={() => setSelectedCrop(crop.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  selectedCrop === crop.id
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{crop.icon}</span>
                <span>{crop.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Upload Card */}
        <div className="glass-card">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center cursor-pointer hover:border-brand-500 transition group"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-72 mx-auto rounded-xl shadow-md object-contain" />
            ) : (
              <div className="py-8">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Drop leaf photo or click to upload
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Supports JPG, PNG, WEBP (Clear, well-lit photo of single leaf)
                </p>
                <div className="inline-flex items-center gap-1 mt-4 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  <span>Target: {TARGET_CROPS.find(c => c.id === selectedCrop)?.name}</span>
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 mt-6 text-brand-600 font-medium text-sm">
              <Loader2 className="w-5 h-5 animate-spin" /> Performing precision pathological analysis...
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Diagnostic Notice</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Diagnosis Results Card */}
        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card space-y-5"
          >
            {/* Title Header */}
            <div className="flex items-start justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-700 dark:text-brand-300 mb-1">
                  {result.cropName || 'Crop'}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {result.diseaseName}
                </h3>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    result.severity === 'critical'
                      ? 'bg-red-500 text-white'
                      : result.severity === 'high'
                      ? 'bg-amber-500 text-white'
                      : result.severity === 'medium'
                      ? 'bg-yellow-500 text-slate-900'
                      : result.severity === 'none'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {result.severity || 'low'}
                </span>
              </div>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20">
                <p className="text-xs text-slate-500">Diagnostic Confidence</p>
                <p className="text-2xl font-bold text-brand-600">{result.confidence}%</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500">Health Status</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">
                  {result.diseaseName.includes('Healthy') ? 'Healthy Leaf' : 'Infection Detected'}
                </p>
              </div>
            </div>

            {/* Symptoms Observed */}
            {result.symptoms && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <p className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Observed Symptoms
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.symptoms}
                </p>
              </div>
            )}

            {/* Chemical Treatment & Dosage */}
            {result.chemicalTreatment && result.chemicalTreatment !== 'None required.' && (
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold text-sm">
                  <FlaskConical className="w-4 h-4" />
                  <span>Chemical Treatment & Dosage</span>
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-200">
                  <p className="font-medium text-blue-950 dark:text-blue-100">{result.chemicalTreatment}</p>
                  {result.chemicalDosage && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono bg-blue-100/60 dark:bg-blue-900/40 p-1.5 rounded-lg inline-block">
                      Dosage: {result.chemicalDosage}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Organic & Biological Remedy */}
            {result.organicRemedy && (
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                  <Leaf className="w-4 h-4" />
                  <span>Organic & Eco-Friendly Remedy</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {result.organicRemedy}
                </p>
              </div>
            )}

            {/* Prevention Practices */}
            {result.prevention && result.prevention.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>Preventive Cultural Practices</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-1 pl-5 list-disc">
                  {result.prevention.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Heatmap Overlay */}
            {result.heatmapUrl && (
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                <p className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Lesion Attention Heatmap
                </p>
                <img
                  src={result.heatmapUrl}
                  alt="Lesion Heatmap"
                  className="rounded-xl max-h-48 w-full object-contain border border-slate-200 dark:border-slate-700"
                />
              </div>
            )}
          </motion.div>
        ) : (
          <div className="glass-card p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
            <Leaf className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3 stroke-1" />
            <p className="font-medium text-slate-600 dark:text-slate-400">No leaf analyzed yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Select your crop above and upload a leaf image on the left to view pathology results.
            </p>
          </div>
        )}
      </div>

      {/* Analysis History */}
      <div className="mt-10 glass-card">
        <h3 className="font-semibold flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
          <History className="w-5 h-5 text-brand-600" /> Recent Diagnostic History
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {history.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">No scans recorded yet.</p>
          ) : (
            history.map((h) => (
              <div
                key={h._id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-slate-100 dark:border-slate-800 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {h.cropName || 'Crop'}:
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{h.diseaseName}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 font-medium">
                    {h.confidence}%
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(h.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
