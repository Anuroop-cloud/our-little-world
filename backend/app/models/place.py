from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models import PyObjectId
from bson import ObjectId

class PlaceBase(BaseModel):
    name: str
    note: Optional[str] = None
    image_url: Optional[str] = None
    visited: bool = False
    rotation: float = 0.0

class PlaceCreate(PlaceBase):
    pass

class PlaceUpdate(BaseModel):
    name: Optional[str] = None
    note: Optional[str] = None
    image_url: Optional[str] = None
    visited: Optional[bool] = None
    rotation: Optional[float] = None

class PlaceResponse(PlaceBase):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
