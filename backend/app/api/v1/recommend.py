from fastapi import APIRouter
from qdrant_client import QdrantClient
from app.api.v1.schemas import RecommendRequest, BookResponse
from app.vector.embedding import embed_text

router = APIRouter()

qdrant = QdrantClient(url="http://localhost:6333")
final_results = []

for hit in results:
    payload = hit.payload

    vector_score = hit.score

    g_score = genre_overlap_score(
        user_genres=request.genres,
        book_genres=payload.get("genres", [])
    )

    p_score = page_score(
        preference=request.lengthPreference,
        pages=payload.get("pages")
    )

    final_score = (
        0.6 * vector_score +
        0.25 * g_score +
        0.15 * p_score
    )

    final_results.append({
        **payload,
        "score": round(final_score, 3)
    })

final_results.sort(key=lambda x: x["score"], reverse=True)

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

def genre_overlap_score(user_genres, book_genres):
    if not user_genres or not book_genres:
        return 0.0
    overlap = set(user_genres) & set(book_genres)
    return len(overlap) / len(user_genres)
