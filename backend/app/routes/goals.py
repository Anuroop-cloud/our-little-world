from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime
from app.db.mongodb import get_db
from app.models.goal import GoalCreate, GoalUpdate, GoalResponse
from app.core.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[GoalResponse])
async def get_goals(current_user: dict = Depends(get_current_user)):
    db = get_db()
    return await db.goals.find().to_list(length=100)


@router.post("/", response_model=GoalResponse, status_code=201)
async def create_goal(goal: GoalCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    data = goal.model_dump()
    data["created_at"] = datetime.utcnow()
    result = await db.goals.insert_one(data)
    return await db.goals.find_one({"_id": result.inserted_id})


@router.put("/{id}", response_model=GoalResponse)
async def update_goal(id: str, goal: GoalUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    update_data = {k: v for k, v in goal.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.goals.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    return await db.goals.find_one({"_id": ObjectId(id)})


@router.delete("/{id}", status_code=204)
async def delete_goal(id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db.goals.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    return None