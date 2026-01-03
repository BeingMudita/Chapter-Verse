from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.db.base import Base

class UserSignal(Base):
    __tablename__ = "user_signals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    book_id = Column(String, nullable=False)
    signal = Column(String, nullable=False)  # click | like | save
    created_at = Column(DateTime, default=datetime.utcnow)
