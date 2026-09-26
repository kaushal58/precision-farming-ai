# AI Crop Guardian — PowerPoint Slide Deck

Copy each slide into PowerPoint (title + bullets). Suggested theme: dark green / agriculture gradient.

---

## Slide 1 — Title

**AI Crop Guardian**  
Precision Farming Intelligence Platform

Full-stack AI-powered SaaS for modern agriculture

*Your Name | Institution | Date*

---

## Slide 2 — Problem Statement

**Challenges farmers face today**

- Crop diseases spread before they are visible to the naked eye
- Irrigation is often guesswork — wasting water or stressing crops
- Pest infestations cause major yield loss if detected late
- Weather shifts increase disease and crop-stress risk
- Expert advice is scarce, expensive, and not always in local languages
- Farm data is scattered across notebooks, messages, and memory

---

## Slide 3 — Our Solution

**AI Crop Guardian — one platform, many answers**

| Problem | Our solution |
|--------|----------------|
| Hidden diseases | AI leaf scan + treatment plan |
| Water management | Smart irrigation ML predictor |
| Pests | Image detection with bounding boxes |
| Weather risk | Live forecast + disease-risk alerts |
| Expert gap | Multilingual AI farming assistant |
| Data chaos | Unified health dashboard + PDF reports |

---

## Slide 4 — Project Vision

**Vision**

Empower every farmer with enterprise-grade AI tools — as simple as a mobile app, as powerful as a research lab.

**Mission**

Detect early, irrigate smartly, act on weather, and decide with data — not guesswork.

**Target users**

- Individual farmers  
- Farm managers  
- Agricultural administrators (platform admins)

---

## Slide 5 — Key Features (Overview)

1. **Authentication** — Secure login, roles (Farmer / Admin)  
2. **Landing page** — Modern marketing website  
3. **AI Disease Detection** — CNN + heatmap + history  
4. **Pest Detection** — YOLO-style object detection  
5. **Smart Irrigation** — ML water recommendations  
6. **Weather Intelligence** — Forecasts + risk alerts  
7. **AI Farming Assistant** — Chatbot (EN / Hindi / Gujarati + voice)  
8. **Farm Dashboard** — Health score, charts, notifications  
9. **Crop Management** — Track crops and health  
10. **PDF Reports** — Downloadable farm summary  
11. **Admin Panel** — Users & system analytics  

---

## Slide 6 — System Architecture

**Three-tier microservices architecture**

```
┌─────────────────┐
│  React Client   │  Port 5173 — UI, charts, chatbot
└────────┬────────┘
         │ REST API + WebSocket
┌────────▼────────┐
│  Node.js API    │  Port 5000 — Auth, DB, file uploads
│  MongoDB        │
└────────┬────────┘
         │ HTTP (images / predictions)
┌────────▼────────┐
│  Python AI      │  Port 8000 — Disease, Pest, Irrigation ML
│  FastAPI        │
└─────────────────┘
```

---

## Slide 7 — Technology Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React, Vite, TailwindCSS, Framer Motion, Zustand, Recharts |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, Socket.io |
| **AI / ML** | Python, FastAPI, TensorFlow, OpenCV, Ultralytics (YOLO), scikit-learn |
| **DevOps** | Docker, Docker Compose, Nginx |
| **APIs** | OpenWeather (optional), OpenAI / Gemini (optional) |

---

## Slide 8 — AI Disease Detection

**How it works**

1. Farmer uploads a crop leaf image  
2. Image sent to CNN model (PlantVillage-style classes)  
3. AI returns: disease name, confidence %, severity  
4. Treatment + prevention recommendations  
5. Heatmap visualization (OpenCV overlay)  
6. Report saved to database + alert if critical  

**Tech:** TensorFlow CNN + OpenCV fallback when model not trained

---

## Slide 9 — Pest Detection

**How it works**

1. Upload field or crop photo  
2. YOLOv8-style detection (or contour fallback)  
3. Output: pest type, confidence, bounding boxes  
4. Risk level: low / medium / high  

**Example detections:** aphid, caterpillar, beetle, whitefly, worm

---

## Slide 10 — Smart Irrigation

**Inputs**

- Soil moisture %  
- Temperature, humidity, rainfall  
- Crop type, farm area  

**Outputs**

- Recommended water (liters)  
- Irrigation schedule  
- Risk level + plain-language advice  

**Tech:** ML formulas in FastAPI + server-side fallback

---

## Slide 11 — Weather Intelligence

- Current temperature, humidity, wind  
- 24-hour forecast chart  
- Storm / heavy rain alerts  
- **Disease-weather risk** — e.g. high humidity → fungal disease warning  

**Integration:** OpenWeatherMap API (mock data if no API key)

---

## Slide 12 — AI Farming Assistant

- Floating chatbot on all dashboard pages  
- **Languages:** English, Hindi, Gujarati  
- **Voice input** via Web Speech API  
- Backends: OpenAI → Gemini → local rule-based fallback  
- Topics: disease, irrigation, fertilizer, pests, general farming  

---

## Slide 13 — Farm Dashboard

**At a glance**

- Farm health score (0–100%)  
- Active crops count  
- Irrigation risk status  
- Pest alert count  
- 7-day health trend chart (Recharts)  
- Recent disease reports  
- Notifications panel  

Quick links: Disease scan, Irrigation, Weather

---

## Slide 14 — Admin Panel

**For platform administrators**

- Total users, farmers, admins  
- Disease reports count  
- AI prediction statistics  
- Chart: AI requests by type (disease, pest, irrigation)  
- Recent users list  
- User activate/deactivate & role management  

**Demo login:** admin@aicropguardian.com / admin123

---

## Slide 15 — Database Design (MongoDB)

| Collection | Purpose |
|------------|---------|
| users | Accounts, roles, farm profile |
| crops | Crop name, area, health score |
| diseasereports | AI disease scan history |
| predictions | Irrigation & pest AI results |
| chatbothistories | Chat messages |
| notifications | Alerts (weather, disease, irrigation) |
| weatherlogs | Cached weather data |

---

## Slide 16 — Security & Authentication

- **bcrypt** password hashing (12 rounds)  
- **JWT** tokens for API access  
- Protected routes on frontend + middleware on backend  
- Role-based access: Farmer vs Admin  
- Rate limiting (200 req / 15 min)  
- Helmet.js security headers  
- Forgot password flow with reset token  

---

## Slide 17 — UI / UX Highlights

- Premium SaaS design (glassmorphism, gradients)  
- Dark / light mode  
- Framer Motion animations  
- Fully responsive (mobile-friendly)  
- Skeleton loaders, toast notifications  
- PWA support (installable web app)  
- Landing page: hero, features, stats, testimonials  

---

## Slide 18 — Deployment

**Docker Compose stack**

- MongoDB container  
- Node.js API container  
- Python AI service container  
- React app served via Nginx  

**Development**

```bash
cd server && npm run dev      # API :5000
cd ai-service && uvicorn ...  # AI :8000
cd client && npm run dev      # UI :5173
```

---

## Slide 19 — Demo & Testing

**Demo accounts (after `npm run seed`)**

| Role | Email | Password |
|------|-------|----------|
| Farmer | farmer@demo.com | farmer123 |
| Admin | admin@aicropguardian.com | admin123 |

**Live URL:** http://localhost:5173

Try: upload leaf image → disease result → irrigation predict → chatbot in Hindi

---

## Slide 20 — Results & Impact (Expected)

- Faster disease identification vs manual inspection  
- Data-driven irrigation → potential water savings  
- Centralized farm records and PDF reports  
- 24/7 AI assistant in local languages  
- Scalable architecture for real-world deployment  

*Add your own metrics, screenshots, and test results here.*

---

## Slide 21 — Future Scope

- Production-trained PlantVillage CNN & YOLO weights  
- SMS / WhatsApp alerts for critical diseases  
- Mobile native app (React Native)  
- Government / cooperative dashboards  
- Satellite imagery integration  
- Payment & subscription (SaaS monetization)  

---

## Slide 22 — Conclusion

**AI Crop Guardian** brings together:

✅ Modern web engineering  
✅ Practical machine learning  
✅ Farmer-centric UX  
✅ Production-ready architecture  

**Thank you**

Questions?

*Contact / GitHub / Demo link*

---

## Appendix — Screenshot checklist for PPT

Add these screenshots to strengthen your deck:

1. Landing page hero  
2. Login / Register  
3. Dashboard with health chart  
4. Disease detection result + heatmap  
5. Pest detection with bounding boxes  
6. Irrigation recommendation screen  
7. Weather page with forecast  
8. Chatbot (English + Hindi example)  
9. Admin panel stats  
10. PDF report download  

---

## Design tips for PowerPoint

- **Colors:** `#16a34a` (green), `#0f172a` (dark slate), white text on dark slides  
- **Fonts:** Inter or Calibri; title 32–40pt, body 18–24pt  
- **Icons:** agriculture, leaf, cloud, robot, chart  
- **One idea per slide** — avoid walls of text  
- **30–45 second** narration per slide for a 15–20 min presentation  
