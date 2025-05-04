from fastapi import APIRouter, Depends, Query, status
from typing import Optional, Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import desc, asc

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

router = APIRouter(
    prefix="/api/stories",
    tags=["stories"]
)

@router.get("/featured", response_model=StoriesResponse)
async def get_featured_stories(
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db_session)
):
    """Get featured stories"""
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
    """Get newest stories"""
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
    """Get most popular stories by like count"""
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
    """Filter stories based on criteria"""
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
    """Get detailed information for a specific story"""
    return await increment_story_read_count(db, story_id)

@router.post("/", response_model=StoryDetail, status_code=status.HTTP_201_CREATED)
async def create_story(
    story_data: StoryCreate,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new story"""
    return await create_new_story(db, story_data, current_user.id)

@router.put("/{story_id}", response_model=StoryDetail)
async def update_story(
    story_id: int,
    story_data: StoryBase,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """Update an existing story"""
    return await update_existing_story(db, story_id, story_data, current_user.id)

@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """Delete a story"""
    await delete_story_by_id(db, story_id, current_user.id)
    return None

@router.post("/{story_id}/like", response_model=StoryDetail)
async def like_story(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """Like a story. If already disliked, removes dislike. If already liked, removes like."""
    return await process_story_like(db, story_id, current_user.id)

@router.post("/{story_id}/dislike", response_model=StoryDetail)
async def dislike_story(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """Dislike a story. If already liked, removes like. If already disliked, removes dislike."""
    return await process_story_dislike(db, story_id, current_user.id)
