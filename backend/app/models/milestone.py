from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models import PyObjectId
from bson import ObjectId

class Photo(BaseModel):
    url: str
    caption: Optional[str] = None
    uploadedAt: Optional[str] = None

class MilestoneBase(BaseModel):
    date: str
    title: str
    description: str
    image_url: Optional[str] = None
    photos: Optional[list[Photo]] = []
    location: Optional[str] = None
    caption: Optional[str] = None
    monochrome: bool = False

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneUpdate(BaseModel):
    date: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    photos: Optional[list[Photo]] = None
    location: Optional[str] = None
    caption: Optional[str] = None
    monochrome: Optional[bool] = None

class MilestoneResponse(MilestoneBase):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
