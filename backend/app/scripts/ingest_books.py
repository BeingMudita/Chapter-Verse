import json
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from app.vector.embedding import embed_text

COLLECTION_NAME = "books_clean"
DATA_PATH = "data/processed/books_clean.json"

client = QdrantClient(url="http://localhost:6333")

# 1. Load books
with open(DATA_PATH, "r", encoding="utf-8") as f:
    books = json.load(f)

print(f"Loaded {len(books)} books")

# 2. Create collection (delete if exists for safety)
client.recreate_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(
        BATCH_SIZE=128,  # sentence-transformers dimension
        distance=Distance.COSINE,
    ),
)

print("Collection created:", COLLECTION_NAME)

# 3. Convert books to vectors
points = []

for i in range(0, len(points), BATCH_SIZE):
    batch = points[i:i + BATCH_SIZE]

    for attempt in range(3):
        try:
            client.upsert(
                collection_name=COLLECTION_NAME,
                points=batch,
                wait=True
            )
            break
        except Exception as e:
            print(f"Retry {attempt+1} for batch {i} due to {e}")
            sleep(2)

    print(f"Uploaded {min(i + BATCH_SIZE, len(points))} / {len(points)}")

# 4. Upload to Qdrant
client.upsert(
    collection_name=COLLECTION_NAME,
    points=points,
)

print("Ingestion complete 🚀")