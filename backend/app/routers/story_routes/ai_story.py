from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from app.core.dependencies import get_db_session
from app.auth.dependencies import get_current_user
from app.models import OrmUser, StoryCreate, StoryDetail, Page, AIStoryRequest
from app.services.story_service import create_new_story
from app.services.ai_story_generator import generate_story_from_ai

router = APIRouter()

@router.post("/ai-generate", response_model=StoryDetail, status_code=status.HTTP_201_CREATED)
async def generate_ai_story(
    ai_request: AIStoryRequest,
    current_user: Annotated[OrmUser, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db_session)
):
    """
    Generate a new story using AI based on a user prompt and category.
    The AI will generate the title, description, content, age group, and tags.
    The image will be null.
    """
    try:
        ai_generated_data = await generate_story_from_ai(
            user_prompt=ai_request.user_prompt,
            category=ai_request.category
        )

        # Prepare content pages
        content_pages = [
            Page(text=page.text, image=page.image) for page in ai_generated_data.content
        ]

        story_data_for_create = StoryCreate(
            title=ai_generated_data.title,
            image=ai_generated_data.image,  # Use the generated cover image path
            description=ai_generated_data.description,
            category=ai_request.category, # Category from user input
            content=content_pages,
            is_interactive=True,  # Default, or could be part of AI generation if needed
            age_group=ai_generated_data.age_group,
            tags=ai_generated_data.tags
        )
        
        created_story = await create_new_story(db, story_data_for_create, current_user.id)
        return created_story

    except ValueError as ve: # Specific errors from AI service (config, validation, JSON)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        # Catch-all for other unexpected errors during AI generation or story creation
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate or save AI story: {str(e)}"
        )
