# Chapter-Verse — Intelligent Book Recommendation System

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)

Chapter-Verse is an AI-driven book recommendation system that combines semantic search, behavioral learning, and hybrid ranking to deliver personalized, explainable book suggestions. It consists of a powerful backend API and a user-friendly cross-platform mobile/web app.

The system is designed to feel smart, adaptive, and human-aware — not just keyword-based.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

Traditional recommenders answer: *"Which books are similar to this query?"*

Chapter-Verse answers: *"Which books fit this reader, right now, and why?"*

To achieve this, we combine:
- Semantic meaning
- User behavior signals
- Preference heuristics
- Transparent ranking logic

## Features

- **Semantic Search**: Leverages transformer models to understand book content and user intent beyond keywords.
- **Behavioral Learning**: Tracks user interactions (clicks, likes, saves) to build personalized taste vectors.
- **Hybrid Ranking**: Combines vector similarity, genre overlap, and page length preferences for accurate recommendations.
- **Cold-Start Handling**: Works effectively for new users by blending prompt vectors with defaults.
- **Cross-Platform App**: Native iOS/Android app with web support via Expo.
- **Explainable Recommendations**: Provides scoring breakdowns for transparency.
- **Real-time Personalization**: Adapts recommendations based on ongoing user behavior.

## Architecture

```
Client (Mobile/Web App)
  |
  |  (preferences, vibes, themes)
  v
FastAPI Backend (/api/v1/recommend)
  |
  |── Embed prompt (semantic intent)
  |── Build user taste vector (behavioral memory)
  |── Blend vectors (cold-start aware)
  v
Qdrant Vector Database
  |
  |── Over-fetch semantic matches
  v
Hybrid Re-Ranking Layer
  |
  |── Vector similarity (60%)
  |── Genre overlap (25%)
  |── Page length preference (15%)
  v
Ranked, Explainable Recommendations
```

## Project Structure

### Backend

The backend is built with FastAPI and handles all AI-driven recommendation logic.

```
backend/
├── app/
│   ├── api/v1/
│   │   ├── recommend.py        # Main recommendation endpoint
│   │   ├── signals.py          # User behavior tracking
│   │   ├── router.py           # API router
│   │   └── schemas.py          # Request/response models
│   ├── db/
│   │   ├── models/             # SQLAlchemy models
│   │   └── session.py          # Database session handling
│   ├── services/
│   │   ├── user_profile.py     # Taste vector logic
│   │   ├── recommender.py      # Recommendation service
│   │   └── embeddings.py       # Embedding utilities
│   ├── vector/
│   │   ├── embedding.py        # SentenceTransformer wrapper
│   │   ├── search.py           # Qdrant search logic
│   │   └── client.py           # Qdrant client
│   ├── ml/
│   │   ├── embedding.py        # ML embedding models
│   │   └── builders.py         # Vector builders
│   └── main.py                 # FastAPI app entry point
├── data/
│   ├── raw/                    # Raw book data
│   └── processed/              # Processed datasets
├── scripts/
│   ├── ingest_books.py         # Qdrant data ingestion
│   ├── process_books.py        # Data processing
│   └── seed_books.py           # Database seeding
└── tests/                      # Unit tests
```

### Frontend

The frontend is a React Native app built with Expo, supporting iOS, Android, and Web.

```
frontend/
├── app/                        # Expo Router pages
│   ├── index.tsx               # Home screen
│   ├── discover.tsx            # Book discovery
│   ├── saved.tsx               # Saved books
│   └── questions.tsx           # Preference questions
├── assets/                     # Images and icons
├── constants/                  # App constants
├── contexts/                   # React contexts for state
└── ...
```

## Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- Docker (for Qdrant vector database)
- PostgreSQL database
- Git

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Chapter-Verse
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up databases:**
   - Start PostgreSQL and create a database
   - Run Qdrant with Docker: `docker run -p 6333:6333 qdrant/qdrant`

4. **Configure environment variables:**
   Create a `.env` file with database URLs, API keys, etc.

5. **Initialize the database:**
   ```bash
   alembic upgrade head
   ```

6. **Ingest book data:**
   ```bash
   python -m app.scripts.ingest_books
   ```

7. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on specific platform:**
   - iOS: `npx expo run:ios`
   - Android: `npx expo run:android`
   - Web: `npx expo start --web`

## Usage

### Backend API

The backend provides RESTful APIs for recommendations and user management.

**Get Recommendations:**
```bash
curl -X POST "http://localhost:8000/api/v1/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "genres": ["romance"],
    "vibes": ["dark"],
    "themes": ["intimacy"],
    "pacePreference": "Slow burn",
    "lengthPreference": "Short & sweet (< 300 pages)",
    "limit": 5
  }'
```

**Track User Signals:**
```bash
curl -X POST "http://localhost:8000/api/v1/signals/event" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "book_id": "book456",
    "signal": "click"
  }'
```

### Frontend App

1. Open the app on your device/emulator
2. Answer preference questions to set up your profile
3. Browse recommendations on the Discover screen
4. Save interesting books for later
5. Interact with books to improve future recommendations

## Recommendation Flow (Detailed)

1. **User Request** (`/api/v1/recommend`):
   The client sends preferences, vibes, themes, and reading preferences.

2. **Semantic Embedding**:
   User intent is converted to a 384-dimensional vector using MiniLM transformer.

3. **User Taste Vector**:
   Historical behavior (clicks, likes, saves) builds a personalized taste vector.

4. **Vector Blending**:
   Combines taste vector (70%) and prompt vector (30%) for cold-start resilience.

5. **Semantic Search**:
   Queries Qdrant for top matches, over-fetching for re-ranking.

6. **Hybrid Ranking**:
   Scores books using:
   - Vector similarity: 60%
   - Genre overlap: 25%
   - Page preference: 15%

7. **Response**:
   Returns sorted, scored recommendations with explanations.

## API Documentation

Full API documentation is available at `http://localhost:8000/docs` when the backend is running.

Key endpoints:
- `POST /api/v1/recommend` - Get book recommendations
- `POST /api/v1/signals/event` - Track user interactions
- `GET /api/v1/books` - Search books
- `GET /api/v1/health` - Health check

## Tech Stack

### Backend
- **FastAPI**: High-performance async web framework
- **Qdrant**: Vector database for semantic search
- **SentenceTransformers**: Embedding models
- **PostgreSQL**: Relational database for user data
- **SQLAlchemy**: ORM for database operations
- **Docker**: Containerization

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Framework for universal React apps
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: File-based routing
- **Zustand**: State management
- **TanStack Query**: Data fetching and caching

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure all tests pass and add tests for new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
