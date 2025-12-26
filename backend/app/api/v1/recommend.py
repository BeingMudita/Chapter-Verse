from fastapi import APIRouter
from app.schemas.recommendation import RecommendationRequest
from app.vector.query_builder import build_user_query
from app.vector.embedding import embed_text
from app.vector.search import search_books

router = APIRouter()

@router.post("/recommend")
def recommend_books(preferences: RecommendationRequest):
    query_text = (
        f"A {', '.join(payload.genres)} book "
        f"with {', '.join(payload.vibes)} vibes "
        f"and themes of {', '.join(payload.themes)}"
    )

    query_vector = embed_text(query_text)

    books = search_books(query_vector, limit=15)

    return books
