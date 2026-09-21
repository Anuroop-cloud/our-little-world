from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models import PyObjectId
from bson import ObjectId

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"

class UserResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    username: str
    role: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserInDB(BaseModel):
    id: str
    username: str
    hashed_password: str
    role: str