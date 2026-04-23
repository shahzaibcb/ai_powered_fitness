# Glow Nourish Chat

An AI-powered nutrition chat application. Ask questions about calories, diets, weight loss, and healthy eating and get instant, evidence-based responses from an AI nutrition coach.

---

## Architecture

```
┌─────────────────────┐        POST /chat        ┌──────────────────────┐
│   React Frontend    │ ───────────────────────▶  │  FastAPI Backend     │
│   (Vite + Nginx)    │                           │  (Uvicorn + OpenAI)  │
└─────────────────────┘                           └──────────────────────┘
         │                                                  │
   GKE LoadBalancer                               GKE LoadBalancer
  (frontend-fitness-app-service)           (backend-fitness-app-service)
```

Both services are deployed on **Google Kubernetes Engine (GKE)** in the `fitness-ns` namespace, with images stored in **Google Artifact Registry**.

---

## Project Structure

```
glow-nourish-chat/
├── frontend/                  # React + Vite chat UI
│   ├── src/
│   │   ├── pages/             # Index (chat page), NotFound
│   │   ├── components/
│   │   │   ├── chat/          # AiAvatar, ChatMessage, InputBox, etc.
│   │   │   └── ui/            # Reusable UI components (shadcn-style)
│   │   ├── hooks/
│   │   │   └── useNutritionChat.ts
│   │   └── services/
│   │       └── nutritionApi.ts  # Fetch client for /chat endpoint
│   ├── .env.production        # VITE_API_BASE_URL for production build
│   ├── Dockerfile             # Multi-stage: Node build → Nginx serve
│   └── deployment.yaml        # GKE Deployment + LoadBalancer Service
│
└── backend/                   # FastAPI nutrition AI service
    ├── app/
    │   ├── main.py            # App entrypoint, CORS middleware
    │   ├── api/routes.py      # POST /chat route
    │   ├── core/config.py     # Settings from environment variables
    │   ├── schemas/chat.py    # ChatRequest / ChatResponse models
    │   └── services/
    │       └── openai_service.py  # OpenAI chat completions
    ├── requirements.txt
    ├── Dockerfile
    └── deployment.yaml        # GKE Deployment + LoadBalancer Service
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite 5 |
| Styling | Tailwind CSS, Radix UI, shadcn/ui |
| State / Data | TanStack React Query, react-hook-form, Zod |
| Backend | FastAPI, Uvicorn, Python 3.11 |
| AI | OpenAI API (`gpt-4o-mini` by default) |
| Containerization | Docker (multi-stage builds) |
| Orchestration | Kubernetes (GKE) |
| Registry | Google Artifact Registry |

---

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker
- An OpenAI API key

### Backend

```bash
cd backend
pip install -r requirements.txt
OPENAI_API_KEY=your-key-here uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

---

## Environment Variables

### Backend

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes | — | OpenAI API key |
| `MODEL_NAME` | No | `gpt-4o-mini` | OpenAI model to use |

### Frontend

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | No | `""` (same-origin) | Base URL of the FastAPI backend |

> Vite bakes `VITE_*` variables into the bundle at **build time**. Set them in `.env.production` before building the Docker image.

---

## Docker

Both images must be built for `linux/amd64` when building on Apple Silicon:

```bash
# Backend
docker buildx build \
  --platform linux/amd64 \
  -t us-east1-docker.pkg.dev/<project>/nutrition-repo/backend_fitness_app:latest \
  --push ./backend

# Frontend
docker buildx build \
  --platform linux/amd64 \
  -t us-east1-docker.pkg.dev/<project>/nutrition-repo/frontend_fitness_app:latest \
  --push ./frontend
```

---

## Kubernetes Deployment (GKE)

```bash
# Create the namespace
kubectl create namespace fitness-ns

# Deploy backend
kubectl apply -f backend/deployment.yaml -n fitness-ns

# Deploy frontend
kubectl apply -f frontend/deployment.yaml -n fitness-ns

# Check status
kubectl get pods -n fitness-ns
kubectl get svc -n fitness-ns
```

To update after a new image push:

```bash
kubectl rollout restart deployment/backend-fitness-app -n fitness-ns
kubectl rollout restart deployment/frontend-fitness-app -n fitness-ns
```

---

## API Reference

### `POST /chat`

**Request**
```json
{ "message": "How many calories should I eat daily?" }
```

**Response**
```json
{ "reply": "Daily calorie needs depend on age, weight, height, and activity level..." }
```

### `GET /`

Health check — returns `{ "status": "ok" }`.
