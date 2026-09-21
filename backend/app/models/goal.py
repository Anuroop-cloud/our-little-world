from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models import PyObjectId
from bson import ObjectId

class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    progress: int = 0

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    progress: Optional[int] = None

class GoalResponse(GoalBase):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
