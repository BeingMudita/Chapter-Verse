from fastapi import APIRouter
from qdrant_client import QdrantClient
from app.vector.embedding import embed_text
from app.api.v1.schemas import RecommendRequest, BookResponse
import random

router = APIRouter()

qdrant = QdrantClient(host="localhost", port=6333)
COLLECTION = "books"

def page_match_score(pages: int | None, preference: str | None) -> float:
    if pages is None or preference is None:
        return 0.0

    if preference == "Short & sweet (< 300 pages)":
        return 0.2 if pages < 300 else -0.1

    if preference == "Medium (300-450 pages)":
        return 0.2 if 300 <= pages <= 450 else -0.1

    if preference == "Epic (> 450 pages)":
        return 0.2 if pages > 450 else -0.1

    return 0.0


def pace_score(book: dict, pace: str | None) -> float:
    if pace is None or pace == "I like variety":
        return 0.0

    pages = book.get("pages", 0)

    if pace == "Fast-paced":
        return 0.15 if pages and pages < 350 else -0.05

    if pace == "Slow burn":
        return 0.15 if pages and pages > 400 else -0.05

    return 0.0


@router.post("/", response_model=list[BookResponse])
def recommend_books(payload: RecommendRequest):
    # 1️⃣ Build semantic query
    query_text = (
        f"A {', '.join(payload.genres)} book "
        f"with {', '.join(payload.vibes)} vibes "
        f"and themes of {', '.join(payload.themes)}"
    )

    query_vector = embed_text(query_text)

    # 2️⃣ Vector search (recall)
    curated = []

    for hit in results:
        book = hit.payload
        score = hit.score

        # genre overlap boost
        score += 0.15 * len(
            set(payload.genres) & set(book.get("genres", []))
        )

        # length preference
        score += page_match_score(
            book.get("pages"),
            payload.lengthPreference
        )

        # pace preference
        score += pace_score(
            book,
            payload.pacePreference
        )

        curated.append((score, book))

    curated.sort(key=lambda x: x[0], reverse=True)

    final_books = [book for _, book in curated[: payload.limit]]

    # 3️⃣ Rank + filter
    seen_titles = set()
    curated = []

    for hit in results:
        book = hit.payload

        if book["title"] in seen_titles:
            continue

        score = hit.score

        # genre boost
        score += 0.15 * len(set(payload.genres) & set(book.get("genres", [])))

        curated.append((score, book))
        seen_titles.add(book["title"])

    curated.sort(reverse=True, key=lambda x: x[0])

    # 4️⃣ Add discovery randomness
    top = curated[: payload.limit * 2]
    random.shuffle(top)

    final = top[: payload.limit]

    return [
        BookResponse(
            id=b["id"],
            title=b["title"],
            author=b["author"],
            description=b.get("description"),
            cover_url=b["cover_url"],
            genres=b.get("genres", []),
            pages=b.get("pages"),
        )
        for _, b in final
    ]
