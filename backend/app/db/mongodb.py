from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_obj = Database()

async def connect_to_mongo():
    try:
        db_obj.client = AsyncIOMotorClient(settings.MONGODB_URI)
        db_obj.db = db_obj.client[settings.MONGODB_DATABASE]
        logging.info("Connected to MongoDB")
    except Exception as e:
        logging.error(f"Error connecting to MongoDB: {e}")

async def close_mongo_connection():
    if db_obj.client:
        db_obj.client.close()
        logging.info("Closed MongoDB connection")

def get_db():
    if db_obj.db is None and settings.MONGODB_URI:
        db_obj.client = AsyncIOMotorClient(settings.MONGODB_URI)
        db_obj.db = db_obj.client[settings.MONGODB_DATABASE]
    return db_obj.db

