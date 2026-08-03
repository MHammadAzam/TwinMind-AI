# TwinMind AI

Agentic AI Digital Twin for Gas Turbine Predictive Maintenance.

This repository now contains the initial Phase 1 foundation for a lean 14-day MVP: a clean backend, a polished frontend shell, containerized infrastructure, and an AI-platform workspace ready for future model development.

## Project overview

TwinMind AI is an industrial AI product concept for monitoring gas turbines, detecting anomalies, estimating remaining useful life, and supporting maintenance recommendations through an agentic experience.

The current MVP focus is foundation and structure rather than production models. The repository is intentionally simple, modular, and suitable for rapid iteration during a short competition sprint.

## Technology stack

- Frontend: Next.js, TypeScript, Tailwind CSS, React
- Backend: FastAPI, Python, Pydantic
- Infrastructure: Docker Compose
- AI platform: folder structure for data, notebooks, models, training, evaluation, and inference

## Local setup

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker and Docker Compose

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker Compose

```bash
docker compose up --build
```

## Folder structure

```text
backend/
  app/
    api/
    services/
    schemas/
    main.py
    config.py
frontend/
  app/
  components/
  public/
ai-platform/
  data/
  notebooks/
  models/
  training/
  evaluation/
  inference/
docker-compose.yml
README.md
```

## Notes

- No fake AI models are included yet.
- The repository is intentionally lightweight for an MVP.
- Future phases will add simulator logic, live streaming, ML endpoints, and agentic reasoning.
