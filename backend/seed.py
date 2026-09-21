import asyncio
import os
import bcrypt
from datetime import datetime
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "our_little_world")


async def seed():
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DATABASE]

    # ─── USERS ────────────────────────────────────────────────────────────────
    existing = await db.users.count_documents({})
    if existing == 0:
        print("Creating users...")
        anuroop_hash = bcrypt.hashpw("boyfriend".encode(), bcrypt.gensalt()).decode()
        pooja_hash   = bcrypt.hashpw("girlfrind".encode(), bcrypt.gensalt()).decode()
        await db.users.insert_many([
            {
                "username": "anuroop",
                "display_name": "Anuroop",
                "hashed_password": anuroop_hash,
                "role": "admin",
                "created_at": datetime.utcnow(),
            },
            {
                "username": "pooja",
                "display_name": "Pooja",
                "hashed_password": pooja_hash,
                "role": "admin",
                "created_at": datetime.utcnow(),
            },
        ])
        print("✓ Users created")
    else:
        print("Users already exist — skipping user seed")

    # ─── CLEAR & RE-SEED CONTENT ──────────────────────────────────────────────
    print("Clearing old content data...")
    await db.milestones.delete_many({})
    await db.memories.delete_many({})
    await db.todos.delete_many({})
    await db.places.delete_many({})
    await db.goals.delete_many({})

    # MILESTONES
    milestones = [
        {
            "date": "14 · 02 · 2022",
            "title": "the beginning",
            "description": "we finally admitted we liked each other. who knew it would turn into this?",
            "image_url": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
            "location": "that one coffee shop",
            "caption": "first date butterflies",
            "monochrome": True,
            "created_at": datetime.utcnow(),
        },
        {
            "date": "09 · 08 · 2023",
            "title": "first roadtrip",
            "description": "getting lost for 4 hours and not even caring because we had the best playlist.",
            "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop",
            "location": "nowhere, exactly",
            "caption": "windows down",
            "monochrome": False,
            "created_at": datetime.utcnow(),
        },
        {
            "date": "31 · 12 · 2023",
            "title": "new years eve",
            "description": "dancing in the kitchen at 11:59pm. my favorite way to end the year.",
            "image_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
            "location": "our kitchen",
            "caption": "midnight.",
            "monochrome": True,
            "created_at": datetime.utcnow(),
        },
    ]

    # MEMORIES
    memories = [
        {
            "image_url": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
            "title": "sunday morning",
            "caption": "coffee and absolutely no plans",
            "date": "12 · 05 · 2023",
            "location": "home",
            "category": "LITTLE THINGS",
            "monochrome": True,
            "rotation": -2,
            "aspect": "portrait",
            "created_at": datetime.utcnow(),
        },
    ]

    # TODOS
    todos = [
        {"title": "watch the sunrise together",        "completed": False, "created_at": datetime.utcnow()},
        {"title": "take a completely random road trip", "completed": False, "created_at": datetime.utcnow()},
        {"title": "cook dinner together",               "completed": True,  "created_at": datetime.utcnow()},
    ]

    # PLACES
    places = [
        {"name": "JAPAN", "note": "someday ♡",       "visited": False, "rotation": -2, "created_at": datetime.utcnow()},
        {"name": "GOA",   "note": "just for a weekend", "visited": True,  "rotation": -4, "created_at": datetime.utcnow()},
    ]

    # GOALS
    goals = [
        {"title": "Grow together",      "description": "learn, adapt, and always choose each other", "progress": 40, "created_at": datetime.utcnow()},
        {"title": "Make more memories", "description": "collect moments, not things",                 "progress": 60, "created_at": datetime.utcnow()},
    ]

    print("Inserting seed data...")
    await db.milestones.insert_many(milestones)
    await db.memories.insert_many(memories)
    await db.todos.insert_many(todos)
    await db.places.insert_many(places)
    await db.goals.insert_many(goals)

    print("✓ Seed complete!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())