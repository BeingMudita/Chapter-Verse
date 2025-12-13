from fastapi import APIRouter
from app.schemas.preference import PreferenceCreate, PreferenceResponse

router = APIRouter()

@router.post("/", response_model=PreferenceResponse)
def save_preferences(preferences: PreferenceCreate):
    """
    Receives user questionnaire answers.
    For now, just echoes them back.
    Later: persist + embed.
    """
    return {
        "status": "saved",
        "preferences": preferences
    }
