from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime
from app.db.mongodb import get_db
from app.models.place import PlaceCreate, PlaceUpdate, PlaceResponse
from app.core.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[PlaceResponse])
async def get_places(current_user: dict = Depends(get_current_user)):
    db = get_db()
    return await db.places.find().to_list(length=100)


@router.post("/", response_model=PlaceResponse, status_code=201)
async def create_place(place: PlaceCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    data = place.model_dump()
    data["created_at"] = datetime.utcnow()
    result = await db.places.insert_one(data)
    return await db.places.find_one({"_id": result.inserted_id})


@router.put("/{id}", response_model=PlaceResponse)
async def update_place(id: str, place: PlaceUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    update_data = {k: v for k, v in place.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.places.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Place not found")
    return await db.places.find_one({"_id": ObjectId(id)})


@router.delete("/{id}", status_code=204)
async def delete_place(id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db.places.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Place not found")
    return None