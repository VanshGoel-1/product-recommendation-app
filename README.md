# Product Recommendation App

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Frontend Pages & Routes](#frontend-pages--routes)
- [Deployment](#deployment)
- [Contribution Guidelines](#contribution-guidelines)
- [Contact](#contact)

## Overview
The **Product Recommendation App** is a full‑stack AI‑powered recommendation engine. It leverages **FastAPI** for the backend, **Pinecone** as a vector database, and **Groq (LLaMA 3.1)** for real‑time product description generation. The frontend is built with **React + Vite** and styled using **Tailwind CSS**. Users can search for products using natural language, filter results, and view AI‑generated descriptions.

## Tech Stack
| Layer | Technology | Purpose |
|------|------------|---------|
| **Backend** | FastAPI | High‑performance Python API |
| **Rate Limiting** | SlowAPI | Protects endpoints from abuse |
| **Auth** | Clerk (React) + custom FastAPI auth | User authentication |
| **Database** | SQLModel with PostgreSQL | Persist orders |
| **Vector DB** | Pinecone | Semantic search with embeddings |
| **Embeddings** | HuggingFace `all‑MiniLM‑L6‑v2` | Generate 384‑dim vectors |
| **LLM** | Groq (LLaMA 3.1) | Generate product descriptions |
| **Orchestration** | LangChain | Manage embeddings & LLM calls |
| **Frontend** | React + Vite | Modern, fast UI framework |
| **Styling** | Tailwind CSS | Utility‑first CSS |

## Features
- **Semantic Search** – Natural‑language queries powered by vector embeddings.
- **Generative AI** – Real‑time, AI‑generated product descriptions.
- **Rate Limiting & Input Validation** – Prevents abuse and ensures clean data.
- **Analytics Dashboard** – Summary statistics of product catalog.
- **Filters** – Brand and price range filtering.
- **User Authentication** – Secure sign‑in/out with Clerk.
- **Cart & Checkout Flow** – End‑to‑end purchase simulation.
- **Order Management** – Create and list user orders.
- **User Dashboard** – Personalized view of past activity and recommendations.

## Setup Instructions
### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment (Windows)
py -3.11 -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy the example environment file and fill in values
cp .env.example .env
# Edit .env to set the required keys (see Environment Variables below)

# Run the server
uvicorn app.main:app --reload
```
The backend will be available at `http://localhost:8000`.

### Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
The frontend will be reachable at `http://localhost:5173`.

## Environment Variables
| Variable | Description |
|----------|-------------|
| `PROJECT_NAME` | Name of the project (used in API root response) |
| `SECRET_KEY` | Random secret for FastAPI session security |
| `DATABASE_URL` | PostgreSQL connection string (e.g., `postgresql://user:pass@localhost:5432/prodreco`) |
| `BACKEND_CORS_ORIGINS` | Allowed origins for CORS (e.g., `http://localhost:5173`) |
| `CLERK_SECRET_KEY` | Clerk backend secret for authentication |
| `PINECONE_API_KEY` | Pinecone access token |
| `PINECONE_HOST` | Pinecone host URL |
| `GROQ_API_KEY` | Groq LLM API key |
| `HUGGINGFACEHUB_API_TOKEN` | HuggingFace token for embeddings |

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check – returns a welcome message with project name |
| `GET` | `/healthz` | Simple health endpoint |
| `POST` | `/api/v1/recommend/search` | Search products (supports `brand_filter`, `min_price`, `max_price`) |
| `GET` | `/api/v1/analytics/summary` | Returns brand and category statistics |
| `GET` | `/api/v1/filters/brands` | List unique brand names from Pinecone metadata |
| `POST` | `/api/v1/orders/` | Create a new order (requires authentication) |
| `GET` | `/api/v1/orders/` | List orders for the authenticated user |

## Frontend Pages & Routes
- `/` – Home page (welcome screen) 
- `/search` – Chat page with AI‑driven search
- `/analytics` – Analytics dashboard
- `/cart` – Shopping cart overview
- `/checkout` – Checkout flow
- `/dashboard` – User dashboard with personalized recommendations
- `/sign‑in` & `/sign‑up` – Authentication pages (Clerk)

## Deployment

The repository uses GitHub Actions (`.github/workflows/deploy.yml`) to deploy automatically on every push to `main`.

| Service | Target | Trigger |
|---------|--------|---------|
| Frontend | Vercel | push to `main` |
| Backend | Render | push to `main` (deploy hook) |

### Required GitHub Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | How to get it |
|--------|---------------|
| `VERCEL_TOKEN` | Vercel dashboard → Account Settings → Tokens |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys |
| `VITE_API_BASE_URL` | Your Render service URL (e.g. `https://your-service.onrender.com`) |
| `RENDER_DEPLOY_HOOK_URL` | Render dashboard → your service → Settings → Deploy Hook |

### One-time Vercel setup (run locally once)

```bash
cd frontend
npx vercel link   # links the project and creates .vercel/project.json
```

This creates `.vercel/project.json` which the CI workflow reads via `vercel pull`.
Commit the `.vercel/` directory (it contains no secrets).

### One-time Render setup

1. Go to [render.com](https://render.com) → New → Blueprint and point it at this repo.
   Render will detect `render.yaml` and create the backend service automatically.
2. Fill in all environment variables in the Render dashboard (same keys as `backend/.env.example`).
3. Copy the **Deploy Hook URL** from the service's Settings page into the `RENDER_DEPLOY_HOOK_URL` GitHub secret.

## Contribution Guidelines
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/your-feature`).
3. Follow the existing code style (Prettier for TSX, Black for Python).
4. Write tests for new functionality.
5. Open a Pull Request with a clear description of changes.

## Contact
**Author:** Vansh Goel  
**Email:** vansh.goel@example.com  
**GitHub:** [vanshgoel](https://github.com/vanshgoel)

---
*Generated by Antigravity – your AI coding assistant*
