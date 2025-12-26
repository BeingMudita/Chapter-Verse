from qdrant_client import QdrantClient

qdrant = QdrantClient(url="http://localhost:6333")

COLLECTION_NAME = "books"

def search_books(vector: list[float], limit: int = 10):
    results = qdrant.search(
        collection_name=COLLECTION_NAME,
        query_vector=vector,
        limit=limit
    )

    books = []
    for r in results:
        payload = r.payload
        payload["score"] = round(r.score, 3)
        books.append(payload)

    return books
