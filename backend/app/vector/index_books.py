import json
from pathlib import Path
from sentence_transformers import SentenceTransformer
from qdrant_client.models import VectorParams, Distance, PointStruct

from app.vector.client import qdrant

DATA_PATH = Path("data/processed/books_clean.json")
COLLECTION_NAME = "books"

def build_text(book: dict) -> str:
    genres = ", ".join(book.get("genres", []))
    return f"{book['title']}. {book['description']} Genres: {genres}"

def main():
    print("Loading model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    print("Loading books...")
    books = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    print("Creating collection...")
    qdrant.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=384,
            distance=Distance.COSINE,
        ),
    )

    points = []
    for idx, book in enumerate(books):
        text = build_text(book)
        vector = model.encode(text).tolist()

        points.append(
            PointStruct(
                id=idx,
                vector=vector,
                payload=book
            )
        )

        if idx % 500 == 0:
            print(f"Embedded {idx} books")

    print("Uploading to Qdrant...")
    BATCH_SIZE = 100

    for i in range(0, len(points), BATCH_SIZE):
        batch = points[i : i + BATCH_SIZE]

        qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=batch
        )

        if i % 500 == 0:
            print(f"Uploaded {i}/{len(points)} vectors")
        print("Indexing complete!")

if __name__ == "__main__":
    main()
