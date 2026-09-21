from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models import PyObjectId
from bson import ObjectId


class ChatMessageCreate(BaseModel):
    message: str   # just the text; sender comes from auth token


class ChatMessageUpdate(BaseModel):
    message: str


class ChatMessageResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    sender_username: str
    sender_display_name: str
    message: str
    edited: bool = False
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}