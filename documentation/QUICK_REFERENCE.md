# Quick Reference Card

## Run (3 terminals)

```bash
# AI
cd ai-service && python -m uvicorn main:app --reload --port 8000

# API
cd server && npm run dev

# UI
cd client && npm run dev
```

**App:** http://localhost:5173

## Logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aicropguardian.com | admin123 |
| Farmer | farmer@demo.com | farmer123 |

## Ports

| Service | Port |
|---------|------|
| React | 5173 |
| Express | 5000 |
| FastAPI | 8000 |
| MongoDB | 27017 |

## Seed DB

```bash
cd server && npm run seed
```

## Full docs

See [README.md](./README.md) in this folder.
