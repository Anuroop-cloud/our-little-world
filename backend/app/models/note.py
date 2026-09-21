from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models import PyObjectId
from bson import ObjectId


class NoteCreate(BaseModel):
    content: str  # author comes from auth token, not from client


class NoteResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    author: str          # username
    display_name: str    # pretty name
    content: str
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class NoteUpdate(BaseModel):
    content: Optional[str] = None