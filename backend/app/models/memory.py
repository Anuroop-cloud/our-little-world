from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models import PyObjectId
from bson import ObjectId

class MemoryBase(BaseModel):
    title: str
    caption: str
    date: str
    location: Optional[str] = None
    category: str
    image_url: str
    monochrome: bool = False
    rotation: float = 0.0
    aspect: Optional[str] = None

class MemoryCreate(MemoryBase):
    pass

class MemoryResponse(MemoryBase):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
