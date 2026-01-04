Chapter-Verse Backend — Intelligent Book Recommendation System

Chapter-Verse is an AI-driven book recommendation backend that combines semantic search, behavioral learning, and hybrid ranking to deliver personalized, explainable book suggestions.

This system is designed to feel smart, adaptive, and human-aware — not just keyword-based.

🧠 Core Philosophy

Traditional recommenders answer:

“Which books are similar to this query?”

Chapter-Verse answers:

“Which books fit this reader, right now, and why?”

To achieve this, we combine:

semantic meaning

user behavior signals

preference heuristics

transparent ranking logic

🏗️ Architecture Overview
Client
  |
  |  (preferences, vibes, themes)
  v
FastAPI (/recommend)
  |
  |── Embed prompt (semantic intent)
  |── Build user taste vector (behavioral memory)
  |── Blend vectors (cold-start aware)
  v
Qdrant Vector DB
  |
  |── Over-fetch semantic matches
  v
Hybrid Re-Ranking Layer
  |
  |── Vector similarity
  |── Genre overlap
  |── Page length preference
  v
Ranked, Explainable Recommendations

📂 Project Structure (Backend)
backend/
│
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── recommend.py        # Recommendation endpoint
│   │       ├── signals.py          # User behavior tracking
│   │       ├── router.py           # API router
│   │       └── schemas.py          # All request/response models
│   │
│   ├── db/
│   │   ├── models/
│   │   │   └── user_signal.py      # SQLAlchemy model
│   │   └── session.py              # DB session handling
│   │
│   ├── services/
│   │   └── user_profile.py         # Taste vector logic
│   │
│   ├── vector/
│   │   └── embedding.py            # SentenceTransformer wrapper
│   │
│   └── main.py                     # FastAPI app entry
│
├── data/
│   └── processed/books_clean.json  # Cleaned book dataset
│
├── scripts/
│   └── ingest_books.py             # Qdrant ingestion script
│
└── README.md

🔍 Recommendation Flow (Step-by-Step)
1️⃣ User Request (/api/v1/recommend)

The client sends a structured request:

{
  "user_id": "uuid",
  "genres": ["romance"],
  "vibes": ["dark"],
  "themes": ["intimacy"],
  "pacePreference": "Slow burn",
  "lengthPreference": "Short & sweet (< 300 pages)",
  "limit": 5
}

2️⃣ Semantic Embedding

We convert the user’s intent into a vector using a transformer model:

prompt_vector = embed_text(query_text)


This captures meaning, not keywords.

3️⃣ Cold-Start Personalization (User Taste Vector)

User behavior is stored in user_signal table:

Signal	Meaning
click	interest
like	strong preference
save	long-term intent

From this history we build a taste vector:

taste_vector = build_user_taste_vector(db, user_id)


If the user is new → None is returned safely.

4️⃣ Vector Blending (Smart Default)

We blend who the user is with what they asked for:

final_vector =
  0.7 × taste_vector
+ 0.3 × prompt_vector


If no taste exists → prompt vector is used alone.

This ensures:

cold-start works

learning improves results over time

5️⃣ Semantic Search (Qdrant)

We search the books_clean collection:

qdrant.search(
  collection_name="books_clean",
  query_vector=vector,
  limit=limit * 3,
)


We over-fetch to allow intelligent re-ranking.

6️⃣ Hybrid Ranking (The Secret Sauce 🧪)

Each book is scored using:

Component	Weight
Vector similarity	60%
Genre overlap	25%
Page preference	15%
final_score =
  0.6 * vector_score +
  0.25 * genre_score +
  0.15 * page_score


This makes recommendations feel deliberate, not random.

7️⃣ Final Response

Sorted, trimmed, and returned:

{
  "title": "Lost in the Dark",
  "author": "Brad Weismann",
  "score": 0.2471
}

🧠 User Behavior Tracking (/signals/event)

Every meaningful interaction is recorded:

{
  "user_id": "uuid",
  "book_id": "XCQmzgEACAAJ",
  "signal": "click"
}


This fuels:

personalization

long-term learning

future explainability

🗄️ Vector Database (Qdrant)

Collection: books_clean

Vectors: 384-dim (MiniLM)

Distance: Cosine

Payload: title, author, genres, pages, cover

Books are ingested via:

python -m app.scripts.ingest_books

⚙️ Tech Stack

FastAPI — API framework

Qdrant — Vector database

SentenceTransformers — Embeddings

PostgreSQL — User behavior storage

SQLAlchemy — ORM

Docker — Qdrant containerization