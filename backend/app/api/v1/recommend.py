from fastapi import APIRouter
from qdrant_client import QdrantClient
from app.api.v1.schemas import RecommendRequest, BookResponse
from app.vector.embedding import embed_text

router = APIRouter()

qdrant = QdrantClient(url="http://localhost:6333")

def genre_overlap_score(user_genres: list[str], book_genres: list[str]) -> float:
    if not user_genres or not book_genres:
        return 0.0
    overlap = set(g.lower() for g in user_genres) & set(g.lower() for g in book_genres)
    return len(overlap) / len(user_genres)


def page_score(preference: str | None, pages: int | None) -> float:
    if not preference or not pages:
        return 0.0

    if preference == "Short (<300 pages)":
        return 1.0 if pages < 300 else 0.0
    if preference == "Medium (300-450 pages)":
        return 1.0 if 300 <= pages <= 450 else 0.0
    if preference == "Long (450+ pages)":
        return 1.0 if pages > 450 else 0.0

    return 0.0


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
        limit=payload.limit * 3,  # 🔑 over-fetch for re-ranking
        with_payload=True,
    )

    ranked = []

    for hit in results:
        data = hit.payload or {}

        v_score = hit.score
        g_score = genre_overlap_score(payload.genres, data.get("genres", []))
        p_score = page_score(payload.lengthPreference, data.get("pages"))

        final_score = (
            0.6 * v_score
            + 0.25 * g_score
            + 0.15 * p_score
        )

        ranked.append(
            BookResponse(
                id=data.get("id"),
                title=data.get("title"),
                author=data.get("author"),
                description=data.get("description"),
                genres=data.get("genres", []),
                pages=data.get("pages"),
                cover_url=data.get("cover_url"),
                score=round(final_score, 4),
            )
        )

    ranked.sort(key=lambda x: x.score, reverse=True)

    return ranked[: payload.limit]
