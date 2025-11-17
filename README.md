# AI Product Recommendation App

**Author:** `Vansh Goel`
**Date:** October 21, 2025

This is a full-stack web application built for an intern assignment. It uses a FastAPI backend and a React frontend to deliver AI-powered product recommendations, generative AI descriptions, and data analytics.

---

## Features

* **Semantic Search:** A React-based chat interface allows users to search for products using natural language (e.g., "a comfy red chair").
* **Vector Database:** Product titles and descriptions are converted into 384-dimensional embeddings and stored in a **Pinecone** vector database for fast semantic retrieval.
* **Generative AI:** Uses a **Groq** API (running LLaMA 3.1) to generate new, creative product descriptions for each search result in real-time.
* **Computer Vision:** Includes a notebook that uses a **Zero-Shot Classification** model (OpenAI's CLIP) to accurately classify product images without any training.
* **Data Analytics:** A dedicated analytics page with charts displaying the top product brands and categories, read directly from the dataset.

---

## Deliverables

This repository contains all required deliverables:

1.  **Frontend App:** (`/frontend/product-recommendation-app`) The React + TypeScript application.
2.  **Backend App:** (`/backend`) The FastAPI application.
3.  **Data Analytics Notebook:** (`/notebooks/Data_Analytics_Notebook.ipynb`) Contains the full data cleaning, embedding, and Pinecone upload pipeline.
4.  **Model Training Notebook:** (`/notebooks/Model_Training_Notebook.ipynb`) Demonstrates the zero-shot CV classification model.
5.  **README:** This file.

---

## Tech Stack

| Area | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | **FastAPI** | High-performance Python API framework. |
| **Frontend** | **React (with Vite)** | Modern frontend library for the user interface. |
| **Language** | **Python 3.11+** & **TypeScript** | Type-safe code for both backend and frontend. |
| **Vector DB** | **Pinecone** | Storing and querying text embeddings. |
| **NLP (Embeddings)** | **LangChain** (`HuggingFaceEmbeddings`) | Generating `all-MiniLM-L6-v2` embeddings. |
| **GenAI** | **LangChain** (`ChatGroq`) | Generating product descriptions with `llama-3.1-8b-instant`. |
| **CV** | **Hugging Face Transformers** | Zero-shot image classification with `CLIP`. |
| **Analytics** | **Pandas** & **Chart.js** | Data processing and frontend visualization. |

---

## How to Run This Project

You will need two terminals to run the backend and frontend servers simultaneously.

### 1. Backend Setup

First, set up and run the FastAPI server.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a Python virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# 3. Install all required packages
pip install -r requirements.txt

# 4. Set up your API keys
#   - Rename the file `.env.example` to `.env`
#   - Open `.env` and add your keys for:
#     - PINECONE_API_KEY
#     - PINECONE_HOST
#     - GROQ_API_KEY
#     - SECRET_KEY (can be any random string)

# 5. Run the server
uvicorn app.main:app --reload