from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.cloudinary import upload_image
from app.core.auth import get_current_user

router = APIRouter()


@router.post("/", status_code=201)
async def upload_file(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:  # 10 MB max
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")
    try:
        result = upload_image(content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))