from pydantic import BaseModel
from typing import List, Optional

class RecommendationRequest(BaseModel):
    genres: List[str] = []
    vibes: List[str] = []
    themes: List[str] = []
    pacePreference: Optional[str] = None
    lengthPreference: Optional[str] = None
