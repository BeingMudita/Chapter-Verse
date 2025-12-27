from fastapi import APIRouter
from qdrant_client import QdrantClient
from app.api.v1.schemas import RecommendRequest
from app.vector.embedding import embed_text

router = APIRouter()

qdrant = QdrantClient(url="http://localhost:6333")


@router.post("/recommend")
def recommend_books(request: RecommendRequest):
    # 1. Build query text
    query_text = " ".join(
        request.genres
        + request.vibes
        + request.themes
        + [request.pacePreference, request.lengthPreference]
    )

    # 2. Embed query
    vector = embed_text(query_text)

    # 3. Search Qdrant
    results = qdrant.search(
        collection_name="books_clean",
        query_vector=vector,
        limit=request.limit,
        with_payload=True,
    )

    # 4. Observation only
    response = []

    for hit in results:
        payload = hit.payload or {}

        response.append({
            "id": payload.get("id"),
            "title": payload.get("title"),
            "author": payload.get("author"),
            "description": payload.get("description"),
            "genres": payload.get("genres", []),
            "pages": payload.get("pages"),
            "cover_url": payload.get("cover_url"),
            "vector_score": round(hit.score, 4)
        })

    return response
