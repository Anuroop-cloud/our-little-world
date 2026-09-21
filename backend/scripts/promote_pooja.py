import asyncio
import os
import sys
from dotenv import load_dotenv

# Path setup
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, backend_dir)

# Load env from backend/.env
load_dotenv(os.path.join(backend_dir, ".env"))

from app.db.mongodb import connect_to_mongo, get_db

async def promote():
    await connect_to_mongo()
    db = get_db()
    
    # Update both pooja and anuroop to have role = "admin"
    res = await db.users.update_many(
        {"username": {"$in": ["pooja", "anuroop"]}},
        {"$set": {"role": "admin"}}
    )
    print(f"Successfully updated users: {res.modified_count} users set to admin role.")

if __name__ == "__main__":
    asyncio.run(promote())
