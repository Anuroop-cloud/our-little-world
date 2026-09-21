import asyncio
import os
import sys

# Add parent directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.mongodb import get_db, connect_to_mongo, close_mongo_connection
from app.core.security import hash_password

async def main():
    await connect_to_mongo()
    db = get_db()
    if db is None:
        print("DB connection not initialized. Check mongodb.py config.")
        return
    await db.users.update_one(
        {"username": "pooja"},
        {"$set": {"hashed_password": hash_password("girlfriend")}}
    )
    print("Password updated for pooja!")

if __name__ == "__main__":
    asyncio.run(main())
