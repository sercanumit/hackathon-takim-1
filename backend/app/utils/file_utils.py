from fastapi import UploadFile, HTTPException
from pathlib import Path
import uuid
import aiofiles
from config import Config 

# Create an uploads directory path
UPLOADS_DIR = Path(__file__).parent.parent.parent / "uploads" / "images"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

def is_valid_image(filename: str) -> bool:
    """Check if the file has a valid image extension."""
    return Path(filename).suffix.lower() in Config.ALLOWED_IMAGE_EXTENSIONS # Use Config

async def save_upload_file(upload_file: UploadFile) -> str:
    """
    Save an uploaded file with validation and return the file path.
    
    Args:
        upload_file: The uploaded file object
        
    Returns:
        str: Relative file path to be stored in the database
        
    Raises:
        HTTPException: If file type is invalid
    """
    if not is_valid_image(upload_file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(Config.ALLOWED_IMAGE_EXTENSIONS)}" 
        )
    
    # Generate a unique filename to prevent collisions
    file_extension = Path(upload_file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOADS_DIR / unique_filename
    
    # Save the file using aiofiles for async I/O
    async with aiofiles.open(file_path, 'wb') as out_file:
        # Read the file in chunks to handle large files efficiently
        while content := await upload_file.read(1024 * 1024):  # 1MB chunks
            await out_file.write(content)
    
    # Return the relative path to be stored in the database
    return f"/uploads/images/{unique_filename}"
