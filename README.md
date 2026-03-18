# Product Recommendation App

**Author:** Vansh Goel
**Date:** October 21, 2025

A full-stack AI-powered product recommendation engine. It uses a **FastAPI** backend to serve semantic search results from a **Pinecone** vector database, and uses **Groq** (LLaMA 3.1) to generate creative product descriptions in real-time. The frontend is built with **React** (Vite) and **Tailwind CSS**.

---

## Features

*   **Semantic Search:** Natural language search (e.g., "ergonomic chair for back pain") powered by vector embeddings.
*   **Generative AI:** Real-time generation of creative product descriptions using LLaMA 3.1.
*   **Security:**
    *   **Rate Limiting:** Protects the API from abuse (e.g., max 20 searches/minute).
    *   **Input Validation:** Strict validation ensures query integrity.
    *   **Secure Config:** Enforced environment variable protection for API keys.
*   **Vector Database:** Uses **Pinecone** to store and retrieve 384-dimensional embeddings (`all-MiniLM-L6-v2`).
*   **Analytics:** Visual dashboard for exploring product brands and categories.

---

## Tech Stack

| Area | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | **FastAPI** | High-performance Python API. |
| **Security** | **SlowAPI** | Rate limiting middleware. |
| **Frontend** | **React + Vite** | Modern, fast frontend framework. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework. |
| **Vector DB** | **Pinecone** | Semantic search engine (Serverless). |
| **AI / NLP** | **LangChain** | Orchestrating embeddings (via HF API) and LLM calls. |
| **LLM** | **Groq (LLaMA 3.1)** | Fast inference for text generation. |

---

## Setup Instructions

You will need two terminals to run the backend and frontend servers simultaneously.

### 1. Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a Python virtual environment
# Windows (Python 3.11+)
py -3.11 -m venv .venv
.\.venv\Scripts\activate

# Mac/Linux
python3 -m venv .venv
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure Environment Variables
# Create a .env file based on .env.example
cp .env.example .env

# OPEN .env AND SET THE FOLLOWING:
# PINECONE_API_KEY=your_key
# PINECONE_HOST=your_host_url
# GROQ_API_KEY=your_key
# HUGGINGFACEHUB_API_TOKEN=your_token_from_hf  <-- NEW: For 384-dim embeddings
# SECRET_KEY=generate_a_secure_random_string_here  <-- REQUIRED!
```

> [!CAUTION]
> The application will **fail to start** if `SECRET_KEY` is missing. Do not use a default value in production.

```bash
# 5. Run the Server
uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`.

### 2. Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Run the Development Server
npm run dev
```

The app will open at `http://localhost:5173`.

---

## Security Measures

This project implements several security best practices:

1.  **Rate Limiting**: The search endpoint (`/api/v1/recommend/search`) is limited to prevent abuse.
2.  **Input Sanitization**: Search queries are strictly validated for length and content.
3.  **Secret Management**: Critical API keys are loaded strictly from `.env` and are not hardcoded.
