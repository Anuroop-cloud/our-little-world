from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect, Query
from typing import List
from bson import ObjectId
from datetime import datetime
import json
from app.db.mongodb import get_db
from app.models.chat_message import ChatMessageCreate, ChatMessageUpdate, ChatMessageResponse
from app.core.auth import get_current_user
from app.core.security import decode_token

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.connections: list[tuple[WebSocket, dict]] = []

    async def connect(self, ws: WebSocket, user: dict):
        await ws.accept()
        self.connections.append((ws, user))

    def disconnect(self, ws: WebSocket):
        self.connections = [(w, u) for w, u in self.connections if w is not ws]

    async def broadcast(self, data: dict):
        text = json.dumps(data, default=str)
        dead = []
        for ws, _ in self.connections:
            try:
                await ws.send_text(text)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

    def online_users(self) -> list[str]:
        return [u["username"] for _, u in self.connections]


manager = ConnectionManager()


@router.get("/messages", response_model=List[ChatMessageResponse])
async def get_messages(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.chat_messages.find().sort("created_at", 1).limit(100)
    return await cursor.to_list(length=100)


@router.post("/messages", response_model=ChatMessageResponse, status_code=201)
async def send_message(msg: ChatMessageCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not msg.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    doc = {
        "sender_username": current_user["username"],
        "sender_display_name": current_user["display_name"],
        "message": msg.message.strip(),
        "edited": False,
        "created_at": datetime.utcnow(),
    }
    result = await db.chat_messages.insert_one(doc)
    created = await db.chat_messages.find_one({"_id": result.inserted_id})
    # Broadcast via WebSocket
    await manager.broadcast({
        "type": "new_message",
        "message": {
            "_id": str(created["_id"]),
            "sender_username": created["sender_username"],
            "sender_display_name": created["sender_display_name"],
            "message": created["message"],
            "edited": created["edited"],
            "created_at": created["created_at"].isoformat(),
        },
    })
    return created


@router.put("/messages/{id}", response_model=ChatMessageResponse)
async def edit_message(id: str, update: ChatMessageUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    msg = await db.chat_messages.find_one({"_id": ObjectId(id)})
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    if msg["sender_username"] != current_user["username"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.chat_messages.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"message": update.message.strip(), "edited": True}},
    )
    updated = await db.chat_messages.find_one({"_id": ObjectId(id)})
    await manager.broadcast({
        "type": "edit_message",
        "message": {"_id": str(updated["_id"]), "message": updated["message"], "edited": True},
    })
    return updated


@router.delete("/messages/{id}", status_code=204)
async def delete_message(id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    msg = await db.chat_messages.find_one({"_id": ObjectId(id)})
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    if msg["sender_username"] != current_user["username"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.chat_messages.delete_one({"_id": ObjectId(id)})
    await manager.broadcast({"type": "delete_message", "message_id": id})
    return None


@router.websocket("/ws")
async def chat_ws(websocket: WebSocket, token: str = Query(...)):
    """Authenticated WebSocket endpoint. Pass ?token=<jwt>"""
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=4001)
        return
    username = payload.get("sub")
    db = get_db()
    user_doc = await db.users.find_one({"username": username})
    if not user_doc:
        await websocket.close(code=4001)
        return

    user = {
        "_id": str(user_doc["_id"]),
        "username": user_doc["username"],
        "display_name": user_doc.get("display_name", user_doc["username"]),
        "role": user_doc.get("role", "user"),
    }
    await manager.connect(websocket, user)
    await manager.broadcast({"type": "user_online", "username": user["username"], "online": manager.online_users()})

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)
                if data.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
                elif data.get("type") == "typing":
                    await manager.broadcast({"type": "typing", "username": user["username"], "display_name": user["display_name"]})
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast({"type": "user_offline", "username": user["username"], "online": manager.online_users()})