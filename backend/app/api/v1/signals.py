from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user_book_signal import UserBookSignal
from app.api.v1.schemas.signal import UserSignalRequest

router = APIRouter(prefix="/signals", tags=["signals"])

@router.post("/click")
def record_click(payload: UserSignalRequest, db: Session = Depends(get_db)):
    signal = UserBookSignal(
        user_id=payload.user_id,
        book_id=payload.book_id,
        signal_type="click",
    )
    db.add(signal)
    db.commit()
    return {"status": "ok"}

@router.post("/like")
def record_like(payload: UserSignalRequest, db: Session = Depends(get_db)):
    signal = UserBookSignal(
        user_id=payload.user_id,
        book_id=payload.book_id,
        signal_type="like",
    )
    db.add(signal)
    db.commit()
    return {"status": "ok"}
