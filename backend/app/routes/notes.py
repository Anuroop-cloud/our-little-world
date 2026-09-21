from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime
from app.db.mongodb import get_db
from app.models.note import NoteCreate, NoteResponse
from app.core.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[NoteResponse])
async def get_notes(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.notes.find().sort("created_at", -1)
    return await cursor.to_list(length=100)


@router.post("/", response_model=NoteResponse, status_code=201)
async def create_note(note: NoteCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    doc = {
        "author": current_user["username"],
        "display_name": current_user["display_name"],
        "content": note.content,
        "created_at": datetime.utcnow(),
    }
    result = await db.notes.insert_one(doc)
    return await db.notes.find_one({"_id": result.inserted_id})


@router.delete("/{id}", status_code=204)
async def delete_note(id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    note = await db.notes.find_one({"_id": ObjectId(id)})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note["author"] != current_user["username"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.notes.delete_one({"_id": ObjectId(id)})
    return None