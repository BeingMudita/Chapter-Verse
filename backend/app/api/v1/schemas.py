from pydantic import BaseModel
from typing import List, Optional, Literal

class RecommendRequest(BaseModel):
    # semantic
    genres: List[str]
    vibes: List[str]
    themes: List[str]

    # behavioral
    pacePreference: Optional[Literal[
        "Slow burn", "Fast-paced", "I like variety"
    ]] = None

    lengthPreference: Optional[Literal[
        "Short & sweet (< 300 pages)",
        "Medium (300-450 pages)",
        "Epic (> 450 pages)",
        "Length doesn't matter"
    ]] = None

    limit: Optional[int] = 12
