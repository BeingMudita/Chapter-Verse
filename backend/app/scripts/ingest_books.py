from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from pathlib import Path
import json

from app.vector.embedding import model

# -----------------------------
# Config
# -----------------------------
QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "books_clean"
VECTOR_SIZE = 384          # all-MiniLM-L6-v2
BATCH_SIZE = 128

DATA_PATH = Path("data/processed/books_clean.json")

# -----------------------------
# Load books
# -----------------------------
with open(DATA_PATH, "r", encoding="utf-8") as f:
    books = json.load(f)

print(f"Loaded {len(books)} books")

# -----------------------------
# Build texts + payloads
# -----------------------------
texts = []
payloads = []

for book in books:
    text = (
        f"{book['title']} "
        f"{book['author']} "
        f"{' '.join(book.get('genres', []))} "
        f"{book.get('description', '')}"
    )

    texts.append(text)

    payloads.append({
        "id": book["id"],
        "title": book["title"],
        "author": book["author"],
        "description": book.get("description"),
        "genres": book.get("genres", []),
        "pages": book.get("pages"),
        "cover_url": book.get("cover_url"),
    })

# -----------------------------
# Connect to Qdrant
# -----------------------------
client = QdrantClient(url=QDRANT_URL)

# -----------------------------
# Create collection (if needed)
# -----------------------------
existing = [c.name for c in client.get_collections().collections]

if COLLECTION_NAME not in existing:
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=VECTOR_SIZE,
            distance=Distance.COSINE,
        ),
    )
    print(f"Collection created: {COLLECTION_NAME}")
else:
    print(f"Collection already exists: {COLLECTION_NAME}")

# -----------------------------
# 🔥 Embed ONCE (IMPORTANT)
# -----------------------------
print("Embedding books...")
vectors = model.encode(
    texts,
    batch_size=64,
    show_progress_bar=True,
)

# -----------------------------
# Build points
# -----------------------------
points = [
    PointStruct(
        id=i,
        vector=vectors[i],
        payload=payloads[i],
    )
    for i in range(len(vectors))
]

# -----------------------------
# Upload in batches
# -----------------------------
print("Uploading to Qdrant...")

for i in range(0, len(points), BATCH_SIZE):
    batch = points[i : i + BATCH_SIZE]

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=batch,
        wait=True,
    )

    print(f"Uploaded {min(i + BATCH_SIZE, len(points))} / {len(points)}")

print("Ingestion complete 🚀")
