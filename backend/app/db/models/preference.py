from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.dialects.postgresql import ARRAY

from app.db.base import Base

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    genres = Column(ARRAY(String))
    vibes = Column(ARRAY(String))
    themes = Column(ARRAY(String))

    pace_preference = Column(String, nullable=True)
    length_preference = Column(String, nullable=True)
