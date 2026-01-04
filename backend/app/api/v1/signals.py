from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models.user_signal import UserSignal
from app.api.v1.schemas import UserSignalRequest

router = APIRouter(prefix="/signals", tags=["signals"])

@router.post("/event")
def record_signal(
    payload: UserSignalRequest,
    db: Session = Depends(get_db)
):
    event = UserSignal(
        user_id=payload.user_id,
        book_id=payload.book_id,
        signal=payload.signal,
    )

    db.add(event)
    db.commit()

    return {"status": "ok"}
