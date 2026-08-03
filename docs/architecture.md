# TwinMind AI — Agentic Digital Twin for Gas Turbine Predictive Maintenance
### 14-Day GIKI AI Bootcamp Capstone Architecture

**Design philosophy:** every enterprise pattern is kept only if it demonstrates *engineering judgment* to a Siemens/GE/NVIDIA-caliber judge in a 5-minute demo. Everything that exists only to satisfy production-scale concerns (multi-tenant auth, orchestration, streaming brokers, IaC) is cut. What's kept is real ML, real agentic reasoning, and a UI that looks like a $50k product.

---

## 1. Final Simplified Folder Structure

```
twinmind-ai/
├── docker-compose.yml
├── .env.example
├── README.md
├── docs/
│   └── architecture.md                # this doc, trimmed for submission
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py                    # FastAPI entrypoint, CORS, router mount
│   │   ├── config.py                  # env-driven settings (pydantic-settings)
│   │   ├── database.py                # SQLAlchemy engine/session
│   │   │
│   │   ├── models/                    # SQLAlchemy ORM tables
│   │   │   ├── turbine.py
│   │   │   ├── sensor_reading.py
│   │   │   ├── anomaly.py
│   │   │   ├── maintenance_log.py
│   │   │   └── agent_report.py
│   │   │
│   │   ├── schemas/                   # Pydantic request/response models
│   │   │   ├── turbine.py
│   │   │   ├── sensor.py
│   │   │   ├── anomaly.py
│   │   │   ├── rul.py
│   │   │   └── agent.py
│   │   │
│   │   ├── api/                       # route handlers only, thin
│   │   │   ├── routes_turbines.py
│   │   │   ├── routes_sensors.py
│   │   │   ├── routes_anomaly.py
│   │   │   ├── routes_rul.py
│   │   │   ├── routes_health.py
│   │   │   ├── routes_rca.py
│   │   │   ├── routes_agent.py
│   │   │   └── routes_ws.py           # WebSocket for live streaming
│   │   │
│   │   ├── simulator/
│   │   │   ├── turbine_physics.py     # synthetic sensor generator
│   │   │   ├── fault_injector.py      # injects bearing wear, overheat, surge, etc.
│   │   │   └── stream_engine.py       # background asyncio loop → DB + WS
│   │   │
│   │   ├── ml/
│   │   │   ├── anomaly_detector.py    # Isolation Forest / Autoencoder
│   │   │   ├── rul_model.py           # regression / LSTM RUL predictor
│   │   │   ├── health_score.py        # weighted composite scoring
│   │   │   ├── train_anomaly.py       # offline training script
│   │   │   ├── train_rul.py           # offline training script
│   │   │   └── model_registry/        # saved .pkl / .pt artifacts
│   │   │
│   │   ├── rag/
│   │   │   ├── ingest.py              # chunk + embed maintenance PDFs/manuals
│   │   │   ├── retriever.py           # ChromaDB similarity search wrapper
│   │   │   └── documents/             # source manuals, OEM fault guides
│   │   │
│   │   ├── agent/
│   │   │   ├── graph.py               # LangGraph state machine definition
│   │   │   ├── nodes.py               # diagnose / retrieve / recommend / explain nodes
│   │   │   ├── state.py               # TypedDict agent state schema
│   │   │   └── prompts.py             # system prompts per node
│   │   │
│   │   └── core/
│   │       ├── rca_engine.py          # rule + correlation-based root cause logic
│   │       └── utils.py
│   │
│   └── tests/
│       ├── test_anomaly.py
│       ├── test_rul.py
│       └── test_agent_graph.py
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # main dashboard
│   │   ├── turbine/[id]/page.tsx      # single-turbine deep dive
│   │   └── api/                       # (optional) Next.js proxy routes
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── TurbineGrid.tsx
│   │   │   ├── HealthScoreGauge.tsx
│   │   │   ├── SensorLiveChart.tsx
│   │   │   ├── AnomalyTimeline.tsx
│   │   │   ├── RULCard.tsx
│   │   │   └── AlertFeed.tsx
│   │   ├── agent/
│   │   │   ├── AgentChatPanel.tsx     # chat with LangGraph agent
│   │   │   └── RCAExplainer.tsx       # renders agent's root-cause narrative
│   │   └── ui/                        # shadcn/ui primitives
│   ├── lib/
│   │   ├── api.ts                     # fetch wrappers to FastAPI
│   │   └── ws.ts                      # WebSocket client hook
│   └── types/
│       └── turbine.ts
│
└── data/
    ├── synthetic/                     # generated CSV snapshots for reproducibility
    └── seed/                          # seed data for demo turbines
```

### Purpose of every folder

| Folder | Purpose |
|---|---|
| `backend/app/models` | SQLAlchemy tables — the persistent shape of turbines, readings, anomalies |
| `backend/app/schemas` | API-facing Pydantic contracts, decoupled from DB models |
| `backend/app/api` | Thin HTTP/WebSocket controllers; no business logic lives here |
| `backend/app/simulator` | Generates physically-plausible synthetic turbine telemetry and injects faults on demand — this **is** your dataset, since real turbine data isn't available to students |
| `backend/app/ml` | All trained models: anomaly detection, RUL regression, health scoring, plus the offline training scripts that produced the saved artifacts |
| `backend/app/rag` | Document ingestion + ChromaDB retrieval over OEM manuals / maintenance SOPs |
| `backend/app/agent` | LangGraph agent: the reasoning layer that ties anomaly + RUL + RAG together into a human explanation |
| `backend/app/core` | Root-cause-analysis engine and shared utilities |
| `frontend/components/dashboard` | Real-time visual layer — the "wow factor" for judges |
| `frontend/components/agent` | Chat-style UI to interrogate the agent live during the demo |
| `data/` | Reproducible synthetic datasets so the whole system can be reset/replayed deterministically |

---

## 2. Development Phases (14 Days, Correct Order)

**Team assumption: 2–4 people working in parallel after Day 3.**

| Phase | Days | Deliverable |
|---|---|---|
| **Phase 0 — Foundation** | Day 1 | Repo scaffold, Docker Compose skeleton, SQLite/Postgres schema, FastAPI "hello world", Next.js "hello world" wired together |
| **Phase 1 — Synthetic Data Engine** | Day 2–3 | Turbine physics simulator producing realistic multi-sensor time series (temp, vibration, RPM, pressure, exhaust gas temp) + fault injector for 4–5 failure modes |
| **Phase 2 — Live Streaming Pipeline** | Day 3–4 | Background asyncio loop writes readings to DB every N seconds and pushes over WebSocket; frontend live chart renders it |
| **Phase 3 — Dashboard Core UI** | Day 4–6 | Turbine grid, sensor charts, health gauge, alert feed — built against real streaming data, not mocks |
| **Phase 4 — ML: Anomaly Detection** | Day 5–7 | Train Isolation Forest (+ optional Autoencoder) on simulated normal/abnormal data; serve via `/anomaly` endpoint; wire into dashboard |
| **Phase 5 — ML: RUL Prediction** | Day 6–8 | Feature-engineer degradation trends; train regression (Random Forest / Gradient Boosting, optionally LSTM) to predict remaining cycles-to-failure |
| **Phase 6 — Health Score + RCA Engine** | Day 8–9 | Composite weighted health score (0–100); rule + statistical-correlation RCA that maps anomaly signatures to likely subsystems |
| **Phase 7 — RAG System** | Day 9–10 | Ingest 5–10 turbine maintenance PDFs/manuals into ChromaDB; build retriever; validate retrieval quality manually |
| **Phase 8 — LangGraph Agent** | Day 10–12 | Build the diagnose → retrieve → recommend → explain graph; connect to anomaly + RUL + RCA + RAG as tools/context; expose via `/agent/explain` |
| **Phase 9 — Agent Chat UI** | Day 11–12 | Chat panel in frontend, streaming agent responses, citations from retrieved docs |
| **Phase 10 — Integration Hardening** | Day 12–13 | End-to-end fault-injection demo script, error handling, loading states, seed data reset endpoint |
| **Phase 11 — Polish + Demo Rehearsal** | Day 13–14 | Visual polish (shadcn theming), demo script timing, README, architecture diagram, backup video recording in case of live-demo failure |

**Critical path rule:** the simulator (Phase 1) must be rock-solid before anything else, because every downstream feature — ML, RAG relevance, agent narrative — is graded on how convincingly it responds to injected faults.

---

## 3. First 15 Git Commits

```
1.  chore: initialize monorepo structure (backend/, frontend/, docker-compose.yml)
2.  feat(backend): FastAPI app skeleton with health check endpoint
3.  feat(backend): SQLAlchemy models for Turbine, SensorReading, Anomaly
4.  feat(backend): Alembic-free auto-create schema + SQLite/Postgres config
5.  feat(frontend): Next.js + TypeScript + Tailwind + shadcn/ui scaffold
6.  feat(simulator): turbine physics engine generating baseline sensor signals
7.  feat(simulator): fault injector (bearing wear, overheat, compressor surge, sensor drift)
8.  feat(backend): async streaming loop + WebSocket endpoint for live telemetry
9.  feat(frontend): live sensor chart + turbine grid consuming WebSocket stream
10. feat(ml): anomaly detection model (Isolation Forest) + training script + serving endpoint
11. feat(ml): RUL regression model + feature engineering pipeline + serving endpoint
12. feat(backend): health score engine + root cause analysis rule engine
13. feat(rag): document ingestion pipeline + ChromaDB retriever + sample manuals
14. feat(agent): LangGraph state graph (diagnose → retrieve → recommend → explain)
15. feat(frontend): agent chat panel + RCA explainer UI wired to /agent/explain
```

---

## 4. Required Dependencies

**Backend (`requirements.txt`)**
```
fastapi
uvicorn[standard]
sqlalchemy
pydantic
pydantic-settings
python-dotenv
websockets
scikit-learn
pandas
numpy
joblib
torch                # optional, only if LSTM/autoencoder is used
langgraph
langchain
langchain-openai     # or langchain-anthropic
chromadb
pypdf
tiktoken
```

**Frontend (`package.json` — key packages)**
```
next
react / react-dom
typescript
tailwindcss
shadcn-ui (via CLI, not a package per se)
recharts               # live sensor charts
lucide-react
zustand                # lightweight client state for streaming data
zod                    # runtime validation of API responses
```

**Infra**
```
docker, docker-compose
sqlite3 (dev) OR postgres:16-alpine (docker service)
```

---

## 5. Database Design

Keep it to 5 tables. Every column here earns its place in the demo.

```sql
-- Turbine: the physical asset
CREATE TABLE turbines (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    model         TEXT,
    location      TEXT,
    install_date  DATE,
    status        TEXT DEFAULT 'operational'   -- operational | warning | critical | offline
);

-- SensorReading: the time-series backbone
CREATE TABLE sensor_readings (
    id                SERIAL PRIMARY KEY,
    turbine_id        TEXT REFERENCES turbines(id),
    timestamp         TIMESTAMP NOT NULL,
    rpm               FLOAT,
    exhaust_gas_temp  FLOAT,
    vibration         FLOAT,
    oil_pressure      FLOAT,
    inlet_pressure    FLOAT,
    fuel_flow         FLOAT,
    ambient_temp      FLOAT
);
CREATE INDEX idx_sensor_turbine_time ON sensor_readings(turbine_id, timestamp);

-- Anomaly: ML-flagged events
CREATE TABLE anomalies (
    id             SERIAL PRIMARY KEY,
    turbine_id     TEXT REFERENCES turbines(id),
    timestamp      TIMESTAMP NOT NULL,
    anomaly_score  FLOAT,
    severity       TEXT,          -- low | medium | high | critical
    subsystem      TEXT,          -- e.g. bearing, combustor, compressor
    detected_by    TEXT           -- model name/version
);

-- MaintenanceLog: RAG source metadata + agent recommendations
CREATE TABLE maintenance_logs (
    id             SERIAL PRIMARY KEY,
    turbine_id     TEXT REFERENCES turbines(id),
    created_at     TIMESTAMP DEFAULT now(),
    source         TEXT,          -- 'agent' | 'manual' | 'technician'
    recommendation TEXT,
    linked_anomaly_id INT REFERENCES anomalies(id)
);

-- AgentReport: full agent run trace, for demo replay + judge Q&A
CREATE TABLE agent_reports (
    id              SERIAL PRIMARY KEY,
    turbine_id      TEXT REFERENCES turbines(id),
    created_at      TIMESTAMP DEFAULT now(),
    trigger_anomaly_id INT REFERENCES anomalies(id),
    rca_summary     TEXT,
    rul_estimate    FLOAT,
    health_score    FLOAT,
    explanation     TEXT,          -- full natural-language narrative
    retrieved_docs  JSONB          -- doc chunks used, for citation display
);
```

**Vector store (ChromaDB, separate from relational DB):**
Collection `turbine_maintenance_docs` — chunks of OEM manuals/SOPs, each with metadata `{source, page, subsystem}` for citation and filtering.

---

## 6. API Endpoints

```
# Turbines
GET    /turbines                          list all turbines + current status
GET    /turbines/{id}                     turbine detail
POST   /turbines/{id}/reset               reset to nominal state (demo utility)

# Live telemetry
GET    /turbines/{id}/readings?limit=200  recent sensor history
WS     /ws/turbines/{id}/stream           live sensor stream (push every ~1s)
POST   /simulator/inject-fault            {turbine_id, fault_type} — demo trigger

# ML: Anomaly Detection
GET    /turbines/{id}/anomalies           list detected anomalies
POST   /ml/anomaly/predict                run detector on latest window (internal/manual)

# ML: RUL
GET    /turbines/{id}/rul                 current remaining-useful-life estimate

# Health Score
GET    /turbines/{id}/health              composite health score + contributing factors

# Root Cause Analysis
GET    /turbines/{id}/rca/{anomaly_id}    rule-based root cause breakdown

# RAG
POST   /rag/query                         {question} → retrieved doc chunks (debug endpoint)

# Agentic LangGraph
POST   /agent/explain                     {turbine_id, anomaly_id?} → full diagnosis + recommendation
GET    /agent/reports/{turbine_id}        history of past agent runs
POST   /agent/chat                        free-form Q&A with agent about a turbine (streamed)
```

---

## 7. AI Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SIMULATOR (physics + faults)                │
│   normal signal + injected fault → multivariate sensor stream    │
└──────────────────────────┬────────────────────────────────────--┘
                            │ every ~1s
                            ▼
                 ┌─────────────────────┐
                 │  sensor_readings DB   │──► WebSocket ──► Live dashboard charts
                 └──────────┬───────────┘
                            │ sliding window (e.g. last 60 readings)
                            ▼
        ┌────────────────────────────────────────┐
        │   ANOMALY DETECTOR (Isolation Forest /   │
        │   Autoencoder reconstruction error)      │
        └──────────────────┬───────────────────---┘
                            │ anomaly_score, severity
                            ▼
             ┌───────────────────────────┐
             │  anomalies table (event)   │
             └─────────────┬─────────────┘
                            │ triggers
              ┌─────────────┴──────────────┐
              ▼                            ▼
   ┌─────────────────────┐     ┌──────────────────────────┐
   │  RUL MODEL            │     │  RCA ENGINE (rules +       │
   │  (degradation trend →  │     │  sensor-correlation logic)  │
   │  cycles remaining)     │     └───────────┬───────────---┘
   └───────────┬───────────┘                  │
               │                              │
               ▼                              ▼
         ┌─────────────────────────────────────────┐
         │        HEALTH SCORE ENGINE                │
         │  weighted(anomaly_score, RUL, sensor drift)│
         └───────────────────┬───────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────────┐
        │            LANGGRAPH AGENT                     │
        │  ┌────────┐ ┌───────────┐ ┌───────────┐ ┌─────┐│
        │  │diagnose│→│retrieve   │→│recommend  │→│explain││
        │  │(RCA+RUL│ │(ChromaDB  │ │(map to    │ │(LLM  ││
        │  │+health)│ │ RAG query)│ │ maintenance│ │narrative││
        │  │        │ │           │ │ action)   │ │+ cite)││
        │  └────────┘ └───────────┘ └───────────┘ └─────┘│
        └───────────────────┬────────────────────────────┘
                             ▼
                   agent_reports table
                             │
                             ▼
                  Frontend: RCA Explainer + Chat panel
```

**Key design choice to highlight to judges:** the agent doesn't call an LLM to "guess" the diagnosis — it receives *structured, model-derived facts* (anomaly score, subsystem, RUL, health score) as grounded context, then uses RAG to pull the matching OEM procedure, and only then uses the LLM to compose the explanation. This keeps the ML honest and the LLM auditable — a distinction that separates a serious engineering team from a "wrap GPT around a chatbot" project.

---

## 8. Data Flow Diagram (end-to-end)

```
[Fault Injector] ──▶ [Physics Simulator] ──▶ [Sensor Stream]
                                                   │
                        ┌──────────────────────────┼───────────────────────────┐
                        ▼                          ▼                           ▼
                 [PostgreSQL/SQLite]        [WebSocket Push]            [Feature Window Buffer]
                        │                          │                           │
                        │                          ▼                           ▼
                        │                 [Next.js Live Charts]      [Anomaly Detector Model]
                        │                                                      │
                        │                                                      ▼
                        │                                          [Anomaly Event → DB]
                        │                                                      │
                        │                                     ┌────────────────┼────────────────┐
                        │                                     ▼                                  ▼
                        │                          [RUL Predictor Model]              [RCA Correlation Engine]
                        │                                     │                                  │
                        │                                     └────────────────┬─────────────────┘
                        │                                                      ▼
                        │                                          [Health Score Engine]
                        │                                                      │
                        │                                                      ▼
                        │                                          [LangGraph Agent Trigger]
                        │                                                      │
                        │                         ┌────────────────────────────┼───────────────────────────┐
                        │                         ▼                            ▼                           ▼
                        │              [ChromaDB RAG Retrieval]     [LLM Reasoning/Compose]      [agent_reports DB]
                        │                                                      │
                        └──────────────────────────────────────────────────────┼───────────────────────────┘
                                                                                ▼
                                                                 [Frontend: RCA Explainer + Chat UI]
```

---

## 9. MVP Demo Flow for Judges (target: 5–7 minutes)

1. **Open dashboard (30s)** — grid of 3–4 turbines, all green/healthy, live sensor charts animating in real time. Establishes "this is a live system, not a static mockup."
2. **Trigger a fault (30s)** — click "Inject Fault: Bearing Wear" on Turbine-02 via the demo control. Narrate: *"We're simulating a real degradation pattern, not random noise."*
3. **Watch detection happen live (60s)** — vibration/EGT charts visibly drift; within seconds the anomaly detector flags it, turbine card turns amber → red, health score gauge drops, alert appears in the feed.
4. **Show RUL + Health Score (30s)** — open turbine detail page: RUL card shows "estimated 42 cycles remaining," health score breakdown shows which sensors are driving the drop.
5. **Trigger the agent (60–90s)** — click "Diagnose with AI" → LangGraph agent runs live: shows diagnosis step, retrieved OEM manual excerpt with citation, then a synthesized recommendation ("Schedule bearing inspection within 48 hours; ref. Manual §4.2"). This is the centerpiece — judges see structured ML output become a grounded, cited, human explanation.
6. **Free-form Q&A via chat (60s)** — judge asks the agent a follow-up question live ("what happens if we ignore this for a week?") to prove it's a real reasoning agent, not a canned script.
7. **Close (30s)** — one-slide architecture diagram, emphasize: synthetic-but-physically-grounded data, real trained ML models (not hardcoded rules), grounded RAG (not hallucinated advice), full traceability from raw sensor to final recommendation.

**Judge-proofing tips:**
- Have a pre-recorded backup video of this exact flow in case of live-demo Wi-Fi/API failure.
- Keep an LLM cost/latency fallback (cache a couple of canned agent runs) so a slow API call never stalls the demo.
- Emphasize the **grounding chain** (sensor → ML → RAG → LLM) explicitly — GE/Siemens engineers will immediately respect "no ungrounded LLM output" as a design principle.