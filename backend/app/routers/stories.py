from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional, Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc, asc
from sqlalchemy.orm import selectinload

from app.core.dependencies import get_db_session
from app.auth.dependencies import get_current_user
from app.models import OrmStory, StoryDetail, StoriesResponse, OrmUser, StoryCreate, StoryBase, OrmTag

router = APIRouter(
    prefix="/api/stories",
    tags=["stories"]
)

async def get_story_by_id(
    story_id: int, 
    db: AsyncSession, 
    include_liked_by: bool = False,
    include_disliked_by: bool = False 
):
    query = select(OrmStory).where(OrmStory.id == story_id)
    
    options_to_load = []
    if include_liked_by:
        options_to_load.append(selectinload(OrmStory.liked_by))
    if include_disliked_by: # Add this condition
        options_to_load.append(selectinload(OrmStory.disliked_by))
        
    if options_to_load:
        query = query.options(*options_to_load)
        
    result = await db.execute(query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

async def get_stories_with_filter(
    db: AsyncSession,
    filter_condition,
    sort_column=OrmStory.created_at,
    sort_direction=desc,
    limit: int = 10,
    offset: int = 0
):
    """filtre ve sıralama ile hikayeleri getirmek için yardımcı fonksiyon"""
    count_query = select(func.count()).select_from(OrmStory).where(filter_condition)
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()
    
    query = (
        select(OrmStory)
        .options(selectinload(OrmStory.author), selectinload(OrmStory.tags))
        .where(filter_condition)
        .order_by(sort_direction(sort_column))
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    stories = result.scalars().all()
    
    return total, stories

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
    """en yeni hikayeler"""
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
    """beğeni sayısına göre en popüler hikayeler"""
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
    """hikayeleri kritere göre filtrele"""
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
    """id'si verilen hikaye için bilgi al"""
    story = await get_story_by_id(story_id, db)
    
    story.read_count += 1
    await db.commit()
    
    result = await db.execute(
        select(OrmStory)
        .options(selectinload(OrmStory.tags), selectinload(OrmStory.author))
        .where(OrmStory.id == story_id)
    )
    loaded_story = result.scalar_one_or_none()
    
    if not loaded_story:
        raise HTTPException(status_code=404, detail="Story not found after update")
    
    return loaded_story

@router.post("/", response_model=StoryDetail, status_code=status.HTTP_201_CREATED)
async def create_story(
    story_data: StoryCreate,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """yeni hikaye oluştur"""
    new_story = OrmStory(
        title=story_data.title,
        image=story_data.image,
        description=story_data.description,
        content=story_data.content,
        category=story_data.category,
        is_interactive=story_data.is_interactive,
        age_group=story_data.age_group,
        author_id=current_user.id
    )
    
    db.add(new_story)
    await db.commit()
    
    tags_added = False
    if hasattr(story_data, "tags") and story_data.tags:
        for tag_name in story_data.tags:
            result = await db.execute(
                select(OrmTag).where(OrmTag.name == tag_name)
            )
            tag = result.scalar_one_or_none()
            
            if not tag:
                tag = OrmTag(name=tag_name)
                db.add(tag)
                await db.flush()
            
            new_story.tags.append(tag)
            tags_added = True
    
    if tags_added:
        await db.commit()
    
    await db.refresh(new_story, ['tags', 'author'])
    
    result = await db.execute(
        select(OrmStory)
        .options(selectinload(OrmStory.tags), selectinload(OrmStory.author))
        .where(OrmStory.id == new_story.id)
    )
    loaded_story = result.scalar_one()
    
    return loaded_story

@router.put("/{story_id}", response_model=StoryDetail)
async def update_story(
    story_id: int,
    story_data: StoryBase,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """hikayeyi güncelle"""
    story = await get_story_by_id(story_id, db)
    
    if story.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this story"
        )
    
    for field, value in story_data.dict(exclude_unset=True).items():
        setattr(story, field, value)
    
    await db.commit()
    
    result = await db.execute(
        select(OrmStory)
        .options(selectinload(OrmStory.tags), selectinload(OrmStory.author))
        .where(OrmStory.id == story_id)
    )
    updated_story = result.scalar_one_or_none()
    
    if not updated_story:
        raise HTTPException(status_code=404, detail="Story not found after update")
    
    return updated_story

@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """Bir hikayeyi sil"""
    story = await get_story_by_id(story_id, db)
    
    if story.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this story"
        )
    
    await db.delete(story)
    await db.commit()
    
    return None

@router.post("/{story_id}/like", response_model=StoryDetail)
async def like_story(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """Like a story. If already disliked, removes dislike. If already liked, removes like."""
    story = await get_story_by_id(story_id, db, include_liked_by=True, include_disliked_by=True)
    
    user_id = current_user.id
    user_in_liked_by = any(user.id == user_id for user in story.liked_by)
    user_in_disliked_by = any(user.id == user_id for user in story.disliked_by)

    if user_in_liked_by:
        # kullanıcı zaten beğenmiş, beğeniyi kaldır (toggle off)
        story.liked_by = [user for user in story.liked_by if user.id != user_id]
    else:
        # kullanıcı daha önce beğenmemişti. Beğeniyi ekle.
        story.liked_by.append(current_user)
        # aynı zamanda kullanıcı daha önce dislike attıysa, dislike'ı kaldır
        if user_in_disliked_by:
            story.disliked_by = [user for user in story.disliked_by if user.id != user_id]

    # hesapla ve güncelle
    story.likes = len(story.liked_by) - len(story.disliked_by)
    
    await db.commit()
    
    
    result = await db.execute(
        select(OrmStory)
        .options(
            selectinload(OrmStory.tags), 
            selectinload(OrmStory.author), 
            selectinload(OrmStory.liked_by), 
            selectinload(OrmStory.disliked_by)
        )
        .where(OrmStory.id == story_id)
    )
    loaded_story = result.scalar_one_or_none()
    
    if not loaded_story:
        raise HTTPException(status_code=404, detail="Story not found after like update")
    
    return loaded_story

@router.post("/{story_id}/dislike", response_model=StoryDetail)
async def dislike_story(
    story_id: int,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """Dislike a story. If already liked, removes like. If already disliked, removes dislike."""
    story = await get_story_by_id(story_id, db, include_liked_by=True, include_disliked_by=True)
    
    user_id = current_user.id
    user_in_liked_by = any(user.id == user_id for user in story.liked_by)
    user_in_disliked_by = any(user.id == user_id for user in story.disliked_by)

    if user_in_disliked_by:
        story.disliked_by = [user for user in story.disliked_by if user.id != user_id]
    else:
        story.disliked_by.append(current_user)
        if user_in_liked_by:
            story.liked_by = [user for user in story.liked_by if user.id != user_id]

    story.likes = len(story.liked_by) - len(story.disliked_by)
        
    await db.commit()

    result = await db.execute(
        select(OrmStory)
        .options(
            selectinload(OrmStory.tags), 
            selectinload(OrmStory.author), 
            selectinload(OrmStory.liked_by),
            selectinload(OrmStory.disliked_by) 
        )
        .where(OrmStory.id == story_id)
    )
    loaded_story = result.scalar_one_or_none()
    
    if not loaded_story:
        raise HTTPException(status_code=404, detail="Story not found after dislike update")
    
    return loaded_story
