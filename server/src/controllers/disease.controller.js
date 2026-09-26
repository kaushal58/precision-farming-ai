import path from 'path';
import DiseaseReport from '../models/DiseaseReport.js';
import Notification from '../models/Notification.js';
import * as aiService from '../services/aiService.js';

export const analyzeDisease = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });

    const filePath = req.file.path;
    const crop = req.body.crop || 'auto';

    let aiResult;
    try {
      aiResult = await aiService.detectDisease(filePath, crop);
      if (!aiResult || !aiResult.disease_name) {
        throw new Error('Invalid response from AI disease service');
      }
    } catch (error) {
      console.error('Disease AI service request failed:', error?.message || error);
      return res.status(502).json({
        success: false,
        message: 'AI Disease service unavailable. Please check your network or start the AI service on port 8000.',
      });
    }

    // Check if the uploaded image is an actual plant leaf
    if (aiResult.is_plant_leaf === false) {
      return res.status(400).json({
        success: false,
        isLeaf: false,
        message: 'The uploaded image is not a recognizable crop leaf. Please upload a clear photo of a Tomato, Potato, Corn, or Wheat leaf.',
      });
    }

    const report = await DiseaseReport.create({
      userId: req.user._id,
      cropId: req.body.cropId,
      cropName: aiResult.crop_name || (crop !== 'auto' ? crop : 'General'),
      imageUrl: `/uploads/${path.basename(filePath)}`,
      diseaseName: aiResult.disease_name,
      confidence: aiResult.confidence,
      severity: aiResult.severity,
      symptoms: aiResult.symptoms || '',
      treatment: aiResult.treatment,
      chemicalTreatment: aiResult.chemical_treatment || '',
      chemicalDosage: aiResult.chemical_dosage || '',
      organicRemedy: aiResult.organic_remedy || '',
      prevention: aiResult.prevention || [],
      heatmapUrl: aiResult.heatmap_url,
      aiRaw: aiResult,
    });

    if (aiResult.severity === 'high' || aiResult.severity === 'critical') {
      const notif = await Notification.create({
        userId: req.user._id,
        type: 'disease',
        title: 'Disease Alert',
        message: `${aiResult.disease_name} detected in ${report.cropName} (${aiResult.confidence}% confidence)`,
        severity: 'critical',
        metadata: { reportId: report._id },
      });
      req.app.get('io')?.to(`farm-${req.user._id}`).emit('notification', notif);
    }

    res.json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const reports = await DiseaseReport.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, reports });
  } catch (err) {
    next(err);
  }
};

export const getReport = async (req, res, next) => {
  try {
    const report = await DiseaseReport.findOne({ _id: req.params.id, userId: req.user._id });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, report });
  } catch (err) {
    next(err);
  }
};
