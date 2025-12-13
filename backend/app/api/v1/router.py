from fastapi import APIRouter
from app.api.v1 import health, preferences, recommend, books

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(preferences.router, prefix="/preferences", tags=["preferences"])
api_router.include_router(recommend.router, prefix="/recommend", tags=["recommend"])
api_router.include_router(books.router, prefix="/books", tags=["books"])
