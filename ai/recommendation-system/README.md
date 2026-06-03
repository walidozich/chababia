# Youth Activity Recommendation System

AI-powered backend that recommends youth activities using:

- FastAPI
- SQLite + SQLAlchemy
- Qdrant (vector database)
- Embeddings (semantic search)
- TTL caching (fast repeated feeds)

---

The system generates personalized recommendations using:

- User interests (Sports, Environment, etc.)
- Location (commune / wilaya)
- Past registrations
- AI embeddings + vector similarity search

Pipeline:

User → API → SQLite → Embedding Model → Qdrant → Ranking → Cache → Response

---

# Project Structure

```
- api/          # FastAPI routes
- db/           # SQLAlchemy -models + queries
- embeddings/   # text → vector encoder
- vdb/          # Qdrant client + indexer + searcher
- services/     # recommendation logic
- cache/        # TTL cache layer
- schemas/      # Pydantic schemas
- config.py
- main.py
- recommendation.db # SQLite database (auto-generated)
```

# Setup

## 1. Install dependencies

```bash
pip install -r requirements.txt
```

## 2. Run server

```bash
uvicorn main:app --reload
```

Server runs on:

```bash
http://127.0.0.1:8000
```

# API

## Get feed

```bash
GET /api/feed/{user_id}
```

Example

```bash
GET /api/feed/u1
```

Response

```json
{
  "user_id": "u1",
  "cached": false,
  "profile_summary": "Profile built from: interests (Sports), commune (Akbou)",
  "items": [
    {
      "id": "e1",
      "title": "Eco Walk",
      "category": "Environment",
      "commune": "Akbou",
      "activity_mode": "physical",
      "is_free": true,
      "score": 0.86
    }
  ]
}
```
