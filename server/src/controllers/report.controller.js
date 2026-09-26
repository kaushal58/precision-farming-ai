import PDFDocument from 'pdfkit';
import DiseaseReport from '../models/DiseaseReport.js';
import Prediction from '../models/Prediction.js';
import Crop from '../models/Crop.js';

export const generateFarmReport = async (req, res, next) => {
  try {
    const [crops, diseases, predictions] = await Promise.all([
      Crop.find({ userId: req.user._id }),
      DiseaseReport.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10),
      Prediction.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10),
    ]);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=farm-report.pdf');

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(22).text('AI Crop Guardian — Farm Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Farmer: ${req.user.name}`);
    doc.text(`Farm: ${req.user.farmName || 'N/A'}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(16).text('Crops');
    crops.forEach((c) => doc.fontSize(10).text(`• ${c.name} — Health: ${c.healthScore}% — ${c.status}`));
    doc.moveDown();

    doc.fontSize(16).text('Recent Disease Reports');
    diseases.forEach((d) =>
      doc.fontSize(10).text(`• ${d.diseaseName} (${d.confidence}%) — ${d.severity}`)
    );
    doc.moveDown();

    doc.fontSize(16).text('AI Predictions');
    predictions.forEach((p) =>
      doc.fontSize(10).text(`• ${p.type}: ${JSON.stringify(p.result).slice(0, 80)}...`)
    );

    doc.end();
  } catch (err) {
    next(err);
  }
};
