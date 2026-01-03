from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.schemas.signal import UserSignalRequest
from app.db.session import get_db

router = APIRouter(prefix="/signals", tags=["signals"])


@router.post("/event")
def record_signal(
    payload: UserSignalRequest,
    db: Session = Depends(get_db),
):
    # for now just confirm wiring works
    return {"status": "ok"}
