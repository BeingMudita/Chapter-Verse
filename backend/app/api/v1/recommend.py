from fastapi import APIRouter

router = APIRouter()

@router.post("/")
def recommend():
    return {"message": "Recommendation engine coming soon"}
