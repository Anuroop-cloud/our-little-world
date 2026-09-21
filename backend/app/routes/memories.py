from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime
from app.db.mongodb import get_db
from app.models.memory import MemoryCreate, MemoryResponse
from app.core.auth import get_current_user, require_admin

router = APIRouter()


@router.get("/", response_model=List[MemoryResponse])
async def get_memories(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.memories.find().sort("created_at", -1)
    return await cursor.to_list(length=100)


@router.post("/", response_model=MemoryResponse, status_code=201)
async def create_memory(memory: MemoryCreate, current_user: dict = Depends(require_admin)):
    db = get_db()
    doc = memory.model_dump()
    doc["created_at"] = datetime.utcnow()
    result = await db.memories.insert_one(doc)
    return await db.memories.find_one({"_id": result.inserted_id})


@router.get("/{id}", response_model=MemoryResponse)
async def get_memory(id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    memory = await db.memories.find_one({"_id": ObjectId(id)})
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    return memory


@router.delete("/{id}", status_code=204)
async def delete_memory(id: str, current_user: dict = Depends(require_admin)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db.memories.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Memory not found")
    return None
