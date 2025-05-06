from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc, asc
from sqlalchemy.orm import selectinload
import json
import logging # Import logging

from app.models import OrmStory, OrmTag, OrmUser, Page

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def get_story_by_id(
    story_id: int, 
    db: AsyncSession, 
    include_liked_by: bool = False,
    include_disliked_by: bool = False 
):
    """Get a story by its ID with optional relationship loading"""
    query = select(OrmStory).where(OrmStory.id == story_id)
    
    options_to_load = []
    if include_liked_by:
        options_to_load.append(selectinload(OrmStory.liked_by))
    if include_disliked_by:
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
    """Helper function to get stories with filtering and sorting"""
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

async def create_new_story(db: AsyncSession, story_data, author_id: int):
    """Create a new story with associated tags within a single transaction."""
    content_json = json.dumps([page.dict(exclude_none=True) for page in story_data.content])

    new_story = OrmStory(
        title=story_data.title,
        image=story_data.image,
        description=story_data.description,
        content=content_json,
        category=story_data.category,
        is_interactive=story_data.is_interactive,
        age_group=story_data.age_group,
        author_id=author_id
    )

    # Prepare tags before adding the story to the session
    tags_to_associate = []
    if hasattr(story_data, "tags") and story_data.tags:
        unique_tag_names = list(set(story_data.tags))
        
        # Fetch existing tags
        existing_tags_result = await db.execute(
            select(OrmTag).where(OrmTag.name.in_(unique_tag_names))
        )
        existing_tags = {tag.name: tag for tag in existing_tags_result.scalars()}
        
        tags_to_associate.extend(existing_tags.values())

        # Identify and create new tags
        for tag_name in unique_tag_names:
            if tag_name not in existing_tags:
                new_tag = OrmTag(name=tag_name)
                db.add(new_tag) # Add new tag to session
                tags_to_associate.append(new_tag) # Add the new ORM object

    # Add the story to the session
    db.add(new_story)

    # Flush to assign IDs before association (optional but can help)
    # await db.flush() # Try with and without this flush if issues persist

    # Associate tags *before* commit
    if tags_to_associate:
        new_story.tags.extend(tags_to_associate)

    # Commit everything at once
    try:
        await db.commit()
    except Exception as e:
        await db.rollback() # Rollback on error
        raise HTTPException(status_code=500, detail=f"Database commit error: {str(e)}")

    # Fetch the final story with relationships eagerly loaded for the response
    # Use the committed story's ID
    final_result = await db.execute(
        select(OrmStory)
        .options(selectinload(OrmStory.tags), selectinload(OrmStory.author))
        .where(OrmStory.id == new_story.id)
    )
    loaded_story = final_result.scalar_one_or_none() # Use scalar_one_or_none for safety

    if not loaded_story:
         # This shouldn't happen if commit succeeded, but handle defensively
         raise HTTPException(status_code=404, detail="Story not found after creation commit")

    # Content deserialization for the response model is now handled by Pydantic StoryDetail model
    # No need for manual deserialization here.
    # if loaded_story.content:
    #     try:
    #         content_data = json.loads(loaded_story.content)
    #         if isinstance(content_data, list):
    #              deserialized_pages = []
    #              for page_dict in content_data:
    #                  try:
    #                      if isinstance(page_dict, dict):
    #                          deserialized_pages.append(Page(**page_dict))
    #                      else:
    #                          logger.warning(f"Skipping invalid page data (not a dict) post-creation in story {loaded_story.id}: {page_dict}")
    #                  except TypeError as page_err:
    #                      logger.error(f"Error deserializing page data post-creation in story {loaded_story.id}: {page_err} - Data: {page_dict}")
    #              loaded_story.content = deserialized_pages
    #         else:
    #              logger.warning(f"Story {loaded_story.id} content (post-creation) is not a list: {loaded_story.content}")
    #              loaded_story.content = [Page(text=str(content_data))]
    #     except (json.JSONDecodeError, TypeError) as e:
    #         logger.error(f"Error decoding story content after creation for story {loaded_story.id}: {e}")
    #         loaded_story.content = [Page(text="Error loading content")]
    # else:
    #     loaded_story.content = []

    return loaded_story

async def update_existing_story(db: AsyncSession, story_id: int, story_data, user_id: int):
    """Update an existing story"""
    story = await get_story_by_id(story_id, db)
    
    if story.author_id != user_id:
        raise HTTPException(
            status_code=403,
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

async def delete_story_by_id(db: AsyncSession, story_id: int, user_id: int):
    """Delete a story by its ID"""
    story = await get_story_by_id(story_id, db)
    
    if story.author_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to delete this story"
        )
    
    await db.delete(story)
    await db.commit()
    
    return None

async def process_story_like(db: AsyncSession, story_id: int, user_id: int):
    """Process like action for a story"""
    story = await get_story_by_id(story_id, db, include_liked_by=True, include_disliked_by=True)
    
    user_in_liked_by = any(user.id == user_id for user in story.liked_by)
    user_in_disliked_by = any(user.id == user_id for user in story.disliked_by)

    # Get the current user
    result = await db.execute(select(OrmUser).where(OrmUser.id == user_id))
    current_user = result.scalar_one_or_none()
    
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_in_liked_by:
        # zaten like varsa, kaldır (toggle off)
        story.liked_by = [user for user in story.liked_by if user.id != user_id]
    else:
        # like ekle
        story.liked_by.append(current_user)
        # eğer disliked ise, dislike'i kaldır
        if user_in_disliked_by:
            story.disliked_by = [user for user in story.disliked_by if user.id != user_id]

    # Update likes count
    story.likes = len(story.liked_by) - len(story.disliked_by)
    await db.commit()
    
    # Get updated story
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

async def process_story_dislike(db: AsyncSession, story_id: int, user_id: int):
    """Process dislike action for a story"""
    story = await get_story_by_id(story_id, db, include_liked_by=True, include_disliked_by=True)
    
    user_in_liked_by = any(user.id == user_id for user in story.liked_by)
    user_in_disliked_by = any(user.id == user_id for user in story.disliked_by)

    # Get the current user
    result = await db.execute(select(OrmUser).where(OrmUser.id == user_id))
    current_user = result.scalar_one_or_none()
    
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_in_disliked_by:
        # If already disliked, remove dislike (toggle off)
        story.disliked_by = [user for user in story.disliked_by if user.id != user_id]
    else:
        # Add dislike
        story.disliked_by.append(current_user)
        # If previously liked, remove like
        if user_in_liked_by:
            story.liked_by = [user for user in story.liked_by if user.id != user_id]

    # Update likes count
    story.likes = len(story.liked_by) - len(story.disliked_by)
    await db.commit()
    
    # Get updated story
    result = await db.execute(
        select(OrmStory)
        .options(
            selectinload(OrmStory.tags), selectinload(OrmStory.author), selectinload(OrmStory.liked_by),
            selectinload(OrmStory.disliked_by) 
        )
        .where(OrmStory.id == story_id)
    )
    loaded_story = result.scalar_one_or_none()
    
    if not loaded_story:
        raise HTTPException(status_code=404, detail="Story not found after dislike update")
    
    return loaded_story

async def increment_story_read_count(db: AsyncSession, story_id: int):
    """Increment story read count and return the updated story"""
    # Use selectinload to eagerly load relationships needed for the response *after* the update
    result = await db.execute(
        select(OrmStory)
        .options(selectinload(OrmStory.tags), selectinload(OrmStory.author)) # Eager load here
        .where(OrmStory.id == story_id)
    )
    story = result.scalar_one_or_none()

    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    # Increment count
    story.read_count += 1
    db.add(story) # Mark as dirty
    await db.commit() # Commit the change

    # Refresh is likely not needed as we eager loaded, but can be kept for safety
    # await db.refresh(story, ['tags', 'author']) # Re-fetches data

    # Content deserialization for the response model is now handled by Pydantic StoryDetail model
    # No need for manual deserialization here.
    # if story.content:
    #     try:
    #         content_data = json.loads(story.content)
    #         if isinstance(content_data, list):
    #             deserialized_pages = []
    #             for page_dict in content_data:
    #                 try:
    #                     if isinstance(page_dict, dict):
    #                         deserialized_pages.append(Page(**page_dict))
    #                     else:
    #                         logger.warning(f"Skipping invalid page data (not a dict) after read increment in story {story.id}: {page_dict}")
    #                 except TypeError as page_err:
    #                     logger.error(f"Error deserializing page data after read increment in story {story.id}: {page_err} - Data: {page_dict}")
    #             story.content = deserialized_pages
    #         else:
    #             logger.warning(f"Story {story.id} content (after read increment) is not a list: {story.content}")
    #             story.content = [Page(text=str(content_data))]
    #     except (json.JSONDecodeError, TypeError) as e:
    #         logger.error(f"Error decoding story content after incrementing read count for story {story.id}: {e}")
    #         story.content = [Page(text="Error loading content")]
    # else:
    #     story.content = []

    return story
