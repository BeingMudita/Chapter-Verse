from fastapi import APIRouter
from qdrant_client import QdrantClient
from app.api.v1.schemas import RecommendRequest, BookResponse
from app.vector.embedding import embed_text

router = APIRouter()

qdrant = QdrantClient(url="http://localhost:6333")

@router.post("/recommend", response_model=list[BookResponse])
def recommend_books(payload: RecommendRequest):

    query_text = " ".join(
        payload.genres
        + payload.vibes
        + payload.themes
        + [payload.pacePreference, payload.lengthPreference]
    )

    vector = embed_text(query_text)

    results = qdrant.search(
        collection_name="books_clean",
        query_vector=vector,
        limit=payload.limit,
        with_payload=True,
    )

    books = []
    for hit in results:
        data = hit.payload

        books.append(
            BookResponse(
                id=data["id"],
                title=data["title"],
                author=data["author"],
                description=data.get("description"),
                genres=data.get("genres", []),
                pages=data.get("pages"),
                cover_url=data["cover_url"],
                score=hit.score,
            )
        )

    return books
