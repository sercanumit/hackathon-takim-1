from fastapi import APIRouter, Depends, Query, status, UploadFile, File, HTTPException, Form
from typing import Optional, Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import desc, asc
from pydantic import TypeAdapter 

from app.core.dependencies import get_db_session
from app.auth.dependencies import get_current_user
from app.models import OrmStory, StoryDetail, StoriesResponse, OrmUser, StoryCreate, StoryBase
from app.services.story_service import (
    get_stories_with_filter, 
    create_new_story,
    update_existing_story,
    delete_story_by_id,
    process_story_like,
    process_story_dislike,
    increment_story_read_count
)
from app.utils.file_utils import save_upload_file

router = APIRouter(
    prefix="/api/stories",
    tags=["stories"]
)

@router.post("/upload-image", status_code=status.HTTP_201_CREATED)
async def upload_story_image(
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    file: UploadFile = File(...)
):
    """hikaye için resim yükle"""
    try:
        file_path = await save_upload_file(file)
        return {"filename": file.filename, "file_path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@router.get("/featured", response_model=StoriesResponse)
async def get_featured_stories(
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db_session)
):
    """öne çıkan hikayeleri getir"""
    total, stories = await get_stories_with_filter(
        db, 
        OrmStory.featured == True,
        limit=limit, 
        offset=offset
    )
    
    return {
        "total": total,
        "stories": stories
    }

@router.get("/new", response_model=StoriesResponse)
async def get_new_stories(
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db_session)
):
    """en yeni hikayeleri getir"""
    total, stories = await get_stories_with_filter(
        db, 
        True,
        sort_column=OrmStory.created_at,
        sort_direction=desc,
        limit=limit, 
        offset=offset
    )
    
    return {
        "total": total,
        "stories": stories
    }

@router.get("/popular", response_model=StoriesResponse)
async def get_popular_stories(
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db_session)
):
    """beğeni sayısına göre en popüler hikayeleri getir"""
    total, stories = await get_stories_with_filter(
        db, 
        True,
        sort_column=OrmStory.likes,
        sort_direction=desc,
        limit=limit, 
        offset=offset
    )
    
    return {
        "total": total,
        "stories": stories
    }

@router.get("/filter", response_model=StoriesResponse)
async def filter_stories(
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    category: Optional[str] = None,
    age_group: Optional[str] = None,
    sort_by: str = Query("created_at", regex="^(created_at|likes|read_count)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
    query: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db_session)
):
    """kriterlere göre hikayeleri filtrele"""
    filter_condition = True
    
    if category:
        filter_condition = filter_condition & (OrmStory.category == category)
    
    if age_group:
        filter_condition = filter_condition & (OrmStory.age_group == age_group)
    
    if query:
        search_query = f"%{query}%"
        filter_condition = filter_condition & (
            (OrmStory.title.ilike(search_query)) | 
            (OrmStory.description.ilike(search_query))
        )
    
    if sort_by == "created_at":
        sort_column = OrmStory.created_at
    elif sort_by == "likes":
        sort_column = OrmStory.likes
    else:
        sort_column = OrmStory.read_count
    
    sort_direction = desc if order == "desc" else asc
    
    total, stories = await get_stories_with_filter(
        db,
        filter_condition,
        sort_column=sort_column,
        sort_direction=sort_direction,
        limit=limit,
        offset=offset
    )
    
    return {
        "total": total,
        "stories": stories
    }

@router.get("/{story_id}", response_model=StoryDetail)
async def get_story_detail(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """belirli bir hikaye için detaylı bilgileri getir"""
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
    """
    bireysel form alanlarıyla yeni bir hikaye oluştur.
    """
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
        raise HTTPException(
            status_code=500,
            detail=f"Error creating story: {str(e)}"
        )

@router.put("/{story_id}", response_model=StoryDetail)
async def update_story(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session),
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    """
    - **başlık**: hikaye başlığı
    - **açıklama**: hikayenin kısa açıklaması
    - **kategori**: hikaye kategorisi (ör. Bilim Kurgu, Macera)
    - **resim**: i̇steğe bağlı yeni resim dosyası
    """
    try:
        story_data = {
            "title": title,
            "description": description,
            "category": category,
        }
        
        story_adapter = TypeAdapter(StoryBase)
        story_obj = story_adapter.validate_python(story_data)
        
        if image:
            file_path = await save_upload_file(image)
            story_obj.image = file_path
            
        return await update_existing_story(db, story_id, story_obj, current_user.id)
    
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating story: {str(e)}"
        )

@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """bir hikayeyi sil"""
    try:
        await delete_story_by_id(db, story_id, current_user.id)
        return None
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting story: {str(e)}"
        )

@router.post("/{story_id}/like", response_model=StoryDetail)
async def like_story(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """
    hikayeyi beğen.
    zaten dislike atıldıysa , dislike'ı kaldırır.
    zaten beğenildiyse, beğeniyi kaldırır.
    """
    return await process_story_like(db, story_id, current_user.id)

@router.post("/{story_id}/dislike", response_model=StoryDetail)
async def dislike_story(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """
    hikayeye dislike at. 
    zaten beğenildiyse, beğeniyi kaldırır. 
    zaten dislike atıldıysa, dislike'ı kaldırır.
    """
    return await process_story_dislike(db, story_id, current_user.id)
