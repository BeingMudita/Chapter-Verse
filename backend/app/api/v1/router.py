from fastapi import APIRouter
from app.api.v1 import recommend, signals

api_router = APIRouter()
api_router.include_router(recommend.router, tags=["recommend"])
api_router.include_router(signals.router)
