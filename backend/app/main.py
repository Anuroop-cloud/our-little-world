from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.mongodb import connect_to_mongo, close_mongo_connection, get_db
from app.routes import memories, milestones, todos, places, goals, upload
from app.routes import auth as auth_routes
from app.routes import notes as notes_routes
from app.routes import chat as chat_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    # Create indexes after connection
    db = get_db()
    await db.memories.create_index("created_at")
    await db.milestones.create_index("created_at")
    await db.notes.create_index("created_at")
    await db.chat_messages.create_index("created_at")
    yield
    await close_mongo_connection()

app = FastAPI(title="Our Little World API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
app.include_router(memories.router, prefix="/api/memories", tags=["memories"])
app.include_router(milestones.router, prefix="/api/milestones", tags=["milestones"])
app.include_router(todos.router, prefix="/api/todos", tags=["todos"])
app.include_router(places.router, prefix="/api/places", tags=["places"])
app.include_router(goals.router, prefix="/api/goals", tags=["goals"])
app.include_router(notes_routes.router, prefix="/api/notes", tags=["notes"])
app.include_router(chat_routes.router, prefix="/api/chat", tags=["chat"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])

@app.get("/api/health")
async def health_check():
    try:
        from app.db.mongodb import db_obj
        await db_obj.client.admin.command("ping")
        db_status = "connected"
    except Exception:
        db_status = "disconnected"
    return {"status": "ok", "database": db_status}
