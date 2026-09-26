# AI Crop Guardian — API Reference

Base URL: `http://localhost:5000/api`

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register farmer |
| POST | `/auth/login` | Login, returns JWT |
| POST | `/auth/forgot-password` | Request reset token |
| POST | `/auth/reset-password` | Reset with token |
| GET | `/auth/me` | Current user (Bearer token) |

## Disease

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/disease/analyze` | Upload image (multipart `image`) |
| GET | `/disease/history` | User's reports |
| GET | `/disease/:id` | Single report |

## Pest

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/pest/detect` | Upload image |
| GET | `/pest/history` | Detection history |

## Irrigation

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/irrigation/predict` | soilMoisture, temperature, humidity, rainfall, cropType |

## Weather

| Method | Endpoint | Query |
|--------|----------|-------|
| GET | `/weather` | lat, lon (optional) |

## Chat

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/chat/message` | message, language (en/hi/gu) |
| GET | `/chat/history` | Chat history |

## Dashboard & Admin

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/dashboard` | Farmer |
| GET | `/admin/stats` | Admin |
| GET | `/admin/users` | Admin |

## AI Microservice

Base URL: `http://localhost:8000`

| Method | Endpoint |
|--------|----------|
| GET | `/health` |
| POST | `/api/v1/disease/detect` |
| POST | `/api/v1/pest/detect` |
| POST | `/api/v1/irrigation/predict` |

## Socket.io Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join-farm` | Client → Server | userId |
| `notification` | Server → Client | notification object (e.g. disease alerts) |
