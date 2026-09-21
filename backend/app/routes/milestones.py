from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime
from app.db.mongodb import get_db
from app.models.milestone import MilestoneCreate, MilestoneUpdate, MilestoneResponse
from app.core.auth import get_current_user, require_admin

router = APIRouter()


@router.get("/", response_model=List[MilestoneResponse])
async def get_milestones(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.milestones.find().sort("created_at", 1)
    return await cursor.to_list(length=100)


@router.post("/", response_model=MilestoneResponse, status_code=201)
async def create_milestone(milestone: MilestoneCreate, current_user: dict = Depends(require_admin)):
    db = get_db()
    data = milestone.model_dump()
    data["created_at"] = datetime.utcnow()
    result = await db.milestones.insert_one(data)
    return await db.milestones.find_one({"_id": result.inserted_id})


@router.put("/{id}", response_model=MilestoneResponse)
async def update_milestone(id: str, milestone: MilestoneUpdate, current_user: dict = Depends(require_admin)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    update_data = {k: v for k, v in milestone.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.milestones.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return await db.milestones.find_one({"_id": ObjectId(id)})


@router.delete("/{id}", status_code=204)
async def delete_milestone(id: str, current_user: dict = Depends(require_admin)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db.milestones.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return None
