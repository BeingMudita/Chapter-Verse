from pydantic import BaseModel
from uuid import UUID
from typing import Literal
class UserSignalRequest(BaseModel):
    user_id: str
    book_id: str
    signal: Literal["click", "like", "save"]