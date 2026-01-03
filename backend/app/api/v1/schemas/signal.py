from pydantic import BaseModel
from uuid import UUID

class UserSignalRequest(BaseModel):
    user_id: UUID
    book_id: str
