import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bug, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';

export default function PestPage() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const { data } = await api.post('/pest/detect', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(data);
      toast.success(`Found ${data.prediction?.count || 0} pests`);
    } catch {
      toast.error('Detection failed');
    }
    setLoading(false);
  };

  const detections = result?.prediction?.result?.detections || result?.prediction?.detections || [];

  return (
    <div className="page-container">
      <PageHeader title="Pest Detection" description="YOLOv8-powered insect and pest identification with bounding boxes" />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-brand-500">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Crop" className="max-h-80 mx-auto rounded-xl" />
                {detections.map((d, i) => {
                  const [x1, y1, x2, y2] = d.bbox || [0, 0, 50, 50];
                  return (
                    <div
                      key={i}
                      className="absolute border-2 border-red-500 rounded"
                      style={{ left: `${x1 / 6}%`, top: `${y1 / 6}%`, width: `${(x2 - x1) / 6}%`, height: `${(y2 - y1) / 6}%` }}
                    >
                      <span className="absolute -top-6 left-0 text-xs bg-red-500 text-white px-1 rounded">{d.class}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <Bug className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <p>Upload farm image for pest scan</p>
              </>
            )}
          </div>
          {loading && <div className="flex justify-center mt-4"><Loader2 className="animate-spin" /></div>}
        </div>

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card">
            <p className="text-lg font-bold">Risk: <span className="capitalize text-amber-500">{result.prediction?.result?.risk_level || result.prediction?.risk_level}</span></p>
            <p className="text-slate-500 text-sm mt-1">{detections.length} detection(s)</p>
            <motion.div className="mt-4 space-y-3">
              {detections.map((d, i) => (
                <div key={i} className="flex justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="capitalize font-medium">{d.class}</span>
                  <span className="text-brand-600">{(d.confidence * (d.confidence < 1 ? 100 : 1)).toFixed(0)}%</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
