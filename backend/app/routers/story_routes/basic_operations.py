from fastapi import APIRouter, Depends, status, HTTPException, Form, File, UploadFile
from typing import Optional, Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import TypeAdapter

from app.core.dependencies import get_db_session
from app.auth.dependencies import get_current_user
from app.models import OrmUser, StoryCreate, StoryBase, StoryDetail
from app.services.story_service import (
    create_new_story, update_existing_story, 
    delete_story_by_id, increment_story_read_count
)
from app.utils.file_utils import save_upload_file

router = APIRouter()

@router.get("/{story_id}", response_model=StoryDetail)
async def get_story_detail(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """Get detailed information for a specific story"""
    return await increment_story_read_count(db, story_id)

@router.post("/", response_model=StoryDetail, status_code=status.HTTP_201_CREATED)
async def create_story(
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session),
    title: str = Form(...),
    description: str = Form(...),
    content: str = Form(...),
    category: str = Form(...),
    is_interactive: bool = Form(True),
    age_group: str = Form("all"),
    tags: str = Form(""),
    image: Optional[UploadFile] = File(None)
):
    """Create a new story with individual form fields"""
    try:
        tag_list = [tag.strip() for tag in tags.split(',')] if tags else []
        
        story_data = {
            "title": title,
            "description": description,
            "content": content,
            "category": category,
            "is_interactive": is_interactive,
            "age_group": age_group,
            "tags": tag_list
        }
        
        story_adapter = TypeAdapter(StoryCreate)
        story_obj = story_adapter.validate_python(story_data)
        
        if image:
            file_path = await save_upload_file(image)
            story_obj.image = file_path
            
        return await create_new_story(db, story_obj, current_user.id)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating story: {str(e)}")

# update_story ve delete_story fonksiyonlarını da buraya ekleyebilirsiniz
