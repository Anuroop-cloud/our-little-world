import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

def upload_image(file_content: bytes) -> dict:
    result = cloudinary.uploader.upload(file_content, folder="our_little_world")
    return {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id")
    }
