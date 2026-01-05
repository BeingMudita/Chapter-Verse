from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import uuid4

from app.db.session import get_db
from app.db.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/anonymous")
def create_anonymous_user(db: Session = Depends(get_db)):
    user = User(id=uuid4())
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"user_id": str(user.id)}
