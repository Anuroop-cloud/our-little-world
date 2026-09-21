from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from app.db.mongodb import get_db
from app.core.security import verify_password, create_access_token
from app.core.auth import get_current_user

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(credentials: LoginRequest):
    db = get_db()
    user_doc = await db.users.find_one({"username": credentials.username})
    if not user_doc or not verify_password(credentials.password, user_doc.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    token = create_access_token({"sub": user_doc["username"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "_id": str(user_doc["_id"]),
            "username": user_doc["username"],
            "display_name": user_doc.get("display_name", user_doc["username"]),
            "role": user_doc.get("role", "user"),
        },
    }


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.post("/logout")
async def logout():
    return {"message": "Logged out"}
