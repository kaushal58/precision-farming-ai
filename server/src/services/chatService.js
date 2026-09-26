import axios from 'axios';
import ChatbotHistory from '../models/ChatbotHistory.js';

const SYSTEM_PROMPT = `You are AI Crop Guardian, an expert precision farming agronomist.
You specialize in 4 core crops: Tomato, Potato, Corn, and Wheat.
Provide practical, actionable advice on crop diseases, exact chemical and organic treatments, irrigation schedules, fertilizers, and pest management.
Be concise, clear, and farmer-friendly.
When asked in Hindi or Gujarati, respond fluently and respectfully in that language.`;

const GEMINI_CHAT_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
];

export const getChatResponse = async (userId, message, language = 'en') => {
  await ChatbotHistory.create({ userId, role: 'user', content: message, language });

  let reply;
  if (process.env.GEMINI_API_KEY) {
    reply = await getGeminiResponse(message, language);
  } else if (process.env.OPENAI_API_KEY) {
    reply = await getOpenAIResponse(message, language);
  } else {
    reply = getLocalResponse(message, language);
  }

  await ChatbotHistory.create({ userId, role: 'assistant', content: reply, language });
  return reply;
};

const getGeminiResponse = async (message, language) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const langName = language === 'hi' ? 'Hindi' : language === 'gu' ? 'Gujarati' : 'English';

  for (const model of GEMINI_CHAT_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPT}\nTarget Language: ${langName}\nFarmer's Query: ${message}\nPlease respond directly in ${langName}.`
          }]
        }]
      };
      const { data } = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000,
      });
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err) {
      console.warn(`Chat model ${model} error:`, err.response?.data?.error?.message || err.message);
    }
  }

  return getLocalResponse(message, language);
};

const getOpenAIResponse = async (message, language) => {
  try {
    const { data } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `${SYSTEM_PROMPT} Respond in ${language}.` },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, timeout: 20000 }
    );
    return data.choices[0]?.message?.content || getLocalResponse(message, language);
  } catch {
    return getLocalResponse(message, language);
  }
};

const getLocalResponse = (message, language) => {
  const lower = message.toLowerCase();
  const responses = {
    en: {
      tomato: 'For Tomato: Watch out for Early Blight (target rings on leaves) and Late Blight. Spray Mancozeb 75 WP (2g/L) or 5% Neem seed oil for organic control. Avoid overhead watering.',
      potato: 'For Potato: Late Blight causes rapid leaf rot. Spray Metalaxyl or Mancozeb immediately. Keep soil ridged to protect tubers and avoid waterlogging.',
      corn: 'For Corn: Common Rust shows cinnamon pustules. Apply Azoxystrobin or Propiconazole if severe. Ensure balanced potassium fertilization.',
      wheat: 'For Wheat: Check for Yellow Rust or Powdery Mildew. Apply Tebuconazole (1ml/L) or sulfur dust. Apply NPK 120:60:40 kg/ha in splits.',
      disease: 'Upload a leaf photo in our Disease Detection page for instant diagnosis, chemical dosage, and organic remedies for Tomato, Potato, Corn, or Wheat.',
      irrigation: 'Irrigate during early mornings (5-7 AM) to reduce evaporation and prevent fungal diseases. Keep soil moisture between 50-65%.',
      fertilizer: 'Balanced fertilization is key: apply nitrogen in split doses, and ensure adequate phosphorus and potassium for root strength and disease resistance.',
      default: 'I can guide you on Tomato, Potato, Corn, and Wheat farming, disease treatments, irrigation, and fertilizers. What crop are you asking about?',
    },
    hi: {
      tomato: 'टमाटर के लिए: अगेती झुलसा (Early Blight) के लिए मैंकोजेब 75 WP (2 ग्राम/लीटर) या नीम तेल (5 मिली/लीटर) का छिड़काव करें। पौधों के ऊपर से पानी न दें।',
      potato: 'आलू के लिए: पछेती झुलसा (Late Blight) में पत्तियां काली पड़ने लगती हैं। मेटालेक्सिल + मैंकोजेब का तुरंत छिड़काव करें और खेत में जलभराव न होने दें।',
      corn: 'मक्का के लिए: रतुआ (Rust) रोग के लक्षण दिखने पर प्रोपिकोनाजोल या एजोक्सीस्ट्रोबिन का छिड़काव करें।',
      wheat: 'गेहूं के लिए: पीला रतुआ (Yellow Rust) दिखने पर टेबुकोनाजोल (1 मिली/लीटर) का छिड़काव करें। NPK 120:60:40 अनुपात का प्रयोग करें।',
      disease: 'रोग की सही पहचान के लिए हमारे Disease Detection पेज पर पत्ती की फोटो अपलोड करें, जहां आपको रासायनिक और जैविक दोनों उपाय मिलेंगे।',
      irrigation: 'सुबह 5 से 7 बजे के बीच सिंचाई करें ताकि फंगस का खतरा कम हो और पानी की बचत हो।',
      fertilizer: 'नाइट्रोजन को 2-3 किस्तों में दें और पोटाश का उचित प्रयोग करें जिससे पौधे रोग प्रतिरोधी बनें।',
      default: 'मैं टमाटर, आलू, मक्का और गेहूं की फसलों के रोग, सिंचाई और खाद के बारे में सटीक सलाह दे सकता हूँ। आप क्या जानना चाहते हैं?',
    },
    gu: {
      tomato: 'ટામેટા માટે: આગોતરો સુકારો (Early Blight) અટકાવવા મેન્કોઝેબ 75 WP (2 ગ્રામ/લીટર) અથવા લીમડાનું તેલ (5 મિલી/લીટર) છાંટો. જમીન પાસે જ પાણી આપવું.',
      potato: 'બટાકા માટે: પાછોતરો સુકારો (Late Blight) રોકવા મેટાલેક્સિલ + મેન્કોઝેબનો તાત્કાલિક છંટકાવ કરવો અને ખેતરમાં પાણી ભરાવા ન દેવું.',
      corn: 'મકાઈ માટે: ગેરુ (Rust) રોગના ઉપદ્રવ વખતે પ્રોપીકોનાઝોલનો યોગ્ય છંટકાવ કરવો.',
      wheat: 'ઘઉં માટે: પીળો ગેરુ (Yellow Rust) દેખાય તો ટેબુકોનાઝોલ (1 મિલી/લીટર) છાંટવું. NPK ખાતર નિયમિત માત્રામાં આપવું.',
      disease: 'રોગની સચોટ ઓળખ માટે Disease Detection પેજ પર પાંદડાનો ફોટો અપલોડ કરો. તમને રાસાયણિક અને જૈવિક બંને ઉપાય મળશે.',
      irrigation: 'વહેલી સવારે સિંચાઈ કરવાથી ફૂગજન્ય રોગો અટકે છે અને પાણીનો બગાડ ઘટશે.',
      fertilizer: 'જમીન ચકાસણી મુજબ નાઇટ્રોજન, ફોસ્ફરસ અને પોટાશનો સંતુલિત ઉપયોગ કરવો.',
      default: 'હું ટામેટા, બટાકા, મકાઈ અને ઘઉંના પાક સંરક્ષણ, રોગ નિયંત્રણ અને ખાતર વ્યવસ્થાપનમાં મદદ કરી શકું છું. તમારો પ્રશ્ન જણાવો.',
    },
  };

  const lang = responses[language] || responses.en;
  if (lower.includes('tomato') || lower.includes('टमाटर') || lower.includes('ટામેટા')) return lang.tomato;
  if (lower.includes('potato') || lower.includes('आलू') || lower.includes('બટાકા')) return lang.potato;
  if (lower.includes('corn') || lower.includes('maize') || lower.includes('मक्का') || lower.includes('મકાઈ')) return lang.corn;
  if (lower.includes('wheat') || lower.includes('गेहूं') || lower.includes('ઘઉં')) return lang.wheat;
  if (lower.includes('disease') || lower.includes('रोग') || lower.includes('રોગ')) return lang.disease;
  if (lower.includes('irrigation') || lower.includes('सिंचाई') || lower.includes('સિંચાઈ') || lower.includes('પાણી')) return lang.irrigation;
  if (lower.includes('fertilizer') || lower.includes('खाद') || lower.includes('ખાતર')) return lang.fertilizer;
  return lang.default;
};

export const getChatHistory = (userId, limit = 50) =>
  ChatbotHistory.find({ userId }).sort({ createdAt: -1 }).limit(limit);
