from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base import Base
import uuid

class UserBookSignal(Base):
    __tablename__ = "user_book_signals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    book_id = Column(String, nullable=False)
    signal_type = Column(String, nullable=False)  # "click" | "like"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
