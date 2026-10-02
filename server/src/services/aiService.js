import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const client = axios.create({ baseURL: AI_URL, timeout: 60000 });

const GEMINI_VISION_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
];

/**
 * Multimodal Disease Detection using Google Gemini Vision API.
 * Focused on 4 primary crops: Tomato, Potato, Corn, Wheat (and can identify others).
 */
async function detectDiseaseWithGemini(filePath, crop = 'auto') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key') return null;

  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  const base64Data = fs.readFileSync(filePath).toString('base64');

  const cropConstraint = crop && crop !== 'auto'
    ? `The user selected: "${crop}". If the leaf is indeed from a ${crop} plant, identify the specific ${crop} disease. However, if the leaf is visibly a different plant species (such as Potato, Corn, Wheat, Rice, Cotton, etc.), do NOT force a ${crop} diagnosis — identify the actual plant and its disease truthfully.`
    : `First, identify what plant or crop species this leaf belongs to (e.g. Tomato, Potato, Corn, Wheat, Rice, Cotton, Apple, or other). Then diagnose the disease accurately. Do NOT default to Tomato if it is another crop.`;

  const prompt = `You are a Senior Plant Pathologist and Agronomist specializing in precision agriculture.
Analyze this leaf photograph carefully.
${cropConstraint}

Rules:
1. First, check if the photo is actually a real plant leaf. If it is NOT a plant leaf (e.g. household object, human face, clothing, pet, solid background, drawing), set "is_plant_leaf": false.
2. If it is a real plant leaf, identify the true crop/plant species and whether it is healthy or infected with a specific disease (e.g. Early Blight, Late Blight, Common Rust, Yellow Stripe Rust, Powdery Mildew, Leaf Spot, etc.). Do not guess the same disease for every image.
3. Provide practical, high-value farming advice tailored to farmers.
4. Output STRICTLY a JSON object without markdown fences or additional commentary:
{
  "is_plant_leaf": true,
  "crop_name": "Tomato | Potato | Corn | Wheat | Rice | Cotton | Other",
  "disease_name": "Exact Disease Name (e.g. Corn Common Rust, Tomato Early Blight, Potato Late Blight) or 'Healthy Leaf'",
  "confidence": 95,
  "severity": "none | low | medium | high | critical",
  "symptoms": "Precise visual description of lesions, pustules, rings, chlorosis, or spots observed",
  "treatment": "Direct actionable overview of what the farmer should do immediately",
  "chemical_treatment": "Recommended chemical fungicide or active ingredient (e.g. Mancozeb, Chlorothalonil, Tebuconazole)",
  "chemical_dosage": "Exact practical application rate (e.g. 2.0 to 2.5 grams per litre of water)",
  "organic_remedy": "Eco-friendly biological alternative (e.g. 5% Neem Seed Kernel Extract, Trichoderma viride)",
  "prevention": [
    "Practical cultural prevention step 1",
    "Practical cultural prevention step 2",
    "Practical cultural prevention step 3"
  ]
}`;

  const payload = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType, data: base64Data } }
      ]
    }]
  };

  for (const model of GEMINI_VISION_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const { data } = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      // Extract JSON payload
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleaned);

      const isLeaf = (
        result.is_plant_leaf === true &&
        result.disease_name &&
        result.disease_name !== 'N/A' &&
        !result.disease_name.toLowerCase().includes('not a plant') &&
        !result.disease_name.toLowerCase().includes('no crop leaf')
      );

      if (!isLeaf) {
        return {
          success: false,
          source: 'gemini_vision',
          is_plant_leaf: false,
          crop_name: 'None',
          disease_name: 'No Crop Leaf Detected',
          message: result.symptoms || 'The uploaded photo does not appear to be a recognizable plant leaf. Please upload a clear photo of a crop leaf.',
          confidence: 0,
          severity: 'none',
          heatmap_url: null,
        };
      }

      return {
        success: true,
        source: 'gemini_vision',
        model_used: model,
        is_plant_leaf: true,
        crop_name: result.crop_name || (crop !== 'auto' ? crop : 'General'),
        disease_name: result.disease_name || 'Healthy Leaf',
        disease: result.disease_name || 'Healthy Leaf',
        confidence: Math.min(100, Math.max(50, Number(result.confidence) || 90)),
        severity: result.severity || 'low',
        symptoms: result.symptoms || 'Visual inspection completed.',
        treatment: result.treatment || 'Maintain regular crop monitoring.',
        chemical_treatment: result.chemical_treatment || 'None needed.',
        chemical_dosage: result.chemical_dosage || 'N/A',
        organic_remedy: result.organic_remedy || 'Neem oil spray (5ml/L).',
        prevention: Array.isArray(result.prevention) ? result.prevention : ['Practice regular field monitoring'],
        heatmap_url: null,
      };
    } catch (err) {
      console.warn(`Gemini Vision model ${model} attempt error:`, err.response?.data?.error?.message || err.message);
    }
  }

  return null;
}

export const detectDisease = async (filePath, crop = 'auto') => {
  // 1. Try Gemini Multimodal Vision first if API key is configured
  try {
    const geminiResult = await detectDiseaseWithGemini(filePath, crop);
    if (geminiResult) {
      return geminiResult;
    }
  } catch (err) {
    console.warn('Gemini vision detection skipped/failed, falling back to local engine:', err.message);
  }

  // 2. Fallback to Python FastAPI AI service on port 8000
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('crop', crop);

  try {
    const { data } = await client.post('/api/v1/disease/detect', form, {
      headers: form.getHeaders(),
    });
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(`AI service error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`AI service unavailable: ${error.message}`);
  }
};

export const detectPest = async (filePath) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  const { data } = await client.post('/api/v1/pest/detect', form, {
    headers: form.getHeaders(),
  });
  return data;
};

export const predictIrrigation = async (payload) => {
  const { data } = await client.post('/api/v1/irrigation/predict', payload);
  return data;
};

export const checkAiHealth = async () => {
  const { data } = await client.get('/health');
  return data;
};
