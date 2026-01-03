from pydantic import BaseModel
from typing import List, Optional


class RecommendRequest(BaseModel):
    genres: List[str]
    vibes: List[str]
    themes: List[str]
    pacePreference: Optional[str] = None
    lengthPreference: Optional[str] = None
    limit: int = 5


class BookResponse(BaseModel):
    id: str
    title: str
    author: str
    description: Optional[str]
    genres: List[str]
    pages: Optional[int]
    cover_url: Optional[str]
    score: float
