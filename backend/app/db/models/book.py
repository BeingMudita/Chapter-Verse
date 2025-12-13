from sqlalchemy import Column, String, Integer, Text
from app.db.base import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    genres = Column(Text, nullable=False)
    vibes = Column(Text, nullable=False)
    themes = Column(Text, nullable=False)

    pages = Column(Integer, nullable=True)

    # Vector stored as string (JSON-like)
    embedding = Column(Text, nullable=True)
