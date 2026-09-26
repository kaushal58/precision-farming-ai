import { FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';

export default function ReportsPage() {
  const downloadPdf = async () => {
    try {
      const { data } = await api.get('/reports/pdf', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'farm-report.pdf';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    } catch {
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Farming Reports" description="AI-generated PDF reports for your farm analytics" />
      <div className="glass-card max-w-lg mx-auto text-center py-12">
        <FileDown className="w-16 h-16 mx-auto text-brand-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Generate Farm Report</h3>
        <p className="text-slate-500 text-sm mb-6">Download a comprehensive PDF with crops, disease reports, and AI predictions.</p>
        <button type="button" onClick={downloadPdf} className="btn-primary">
          <FileDown className="w-5 h-5" /> Download PDF Report
        </button>
      </div>
    </div>
  );
}
