# AI Crop Guardian — Precision Farming Intelligence Platform

A production-grade, full-stack AI agriculture SaaS platform for disease detection, smart irrigation, weather intelligence, pest detection, and multilingual farming assistance.

## Documentation

**Full project guide (architecture, features, database, setup, troubleshooting):**

→ **[documentation/README.md](documentation/README.md)**

Quick reference card: [documentation/QUICK_REFERENCE.md](documentation/QUICK_REFERENCE.md)

## Architecture

```
ai-crop-guardian/
├── client/          React + Vite + Tailwind + Framer Motion
├── server/          Node.js + Express + MongoDB + Socket.io
├── ai-service/      Python FastAPI + TensorFlow + OpenCV + YOLO
├── docker/          Docker Compose + production images
├── documentation/   Complete project explanation (start here)
└── docs/            API endpoint reference
```

## Features

- **Authentication** — JWT, bcrypt, roles (farmer/admin), forgot password
- **Landing Page** — Premium SaaS marketing site with animations
- **Disease Detection** — CNN leaf analysis, heatmaps, history
- **Pest Detection** — YOLO-style bounding boxes
- **Smart Irrigation** — ML water recommendations
- **Weather Intelligence** — OpenWeather API + disease-risk alerts
- **AI Chatbot** — OpenAI/Gemini + offline fallback, Hindi/Gujarati/English, voice input
- **Farm Dashboard** — Recharts analytics, health score
- **Admin Panel** — User management, system stats
- **Reports** — PDF farm reports
- **PWA** — Offline-ready progressive web app

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- MongoDB (local or Atlas)

### 1. Install dependencies

```bash
npm run install:all
cd ai-service && pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
# Edit MONGODB_URI, JWT_SECRET, API keys
```

### 3. Seed database

```bash
cd server && npm run seed
```

Demo accounts:
- **Farmer:** `farmer@demo.com` / `farmer123`
- **Admin:** `admin@aicropguardian.com` / `admin123`

### 4. Run development

Terminal 1 — MongoDB (if local):
```bash
mongod
```

Terminal 2 — AI service:
```bash
cd ai-service && uvicorn main:app --reload --port 8000
```

Terminal 3 — API server:
```bash
cd server && npm run dev
```

Terminal 4 — Frontend:
```bash
cd client && npm run dev
```

Or from root (requires all services):
```bash
npm run dev
```

Open **http://localhost:5173**

### Docker

```bash
npm run docker:up
```

## API Documentation

See [docs/API.md](docs/API.md)

## ML Models

Place trained models in `ai-service/models/`:
- `disease_cnn.h5` — TensorFlow CNN (PlantVillage)
- `pest_yolo.pt` — YOLOv8 weights

Without models, the service uses OpenCV heuristics that still return realistic predictions for demos.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind, Framer Motion, Zustand, Recharts |
| Backend | Express, Mongoose, JWT, Multer, Socket.io, Winston |
| AI | FastAPI, TensorFlow, Ultralytics, OpenCV, scikit-learn |
| DevOps | Docker, Docker Compose, Nginx |

## License

MIT
