from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, field_validator
import json
import logging # For potential logging in validator
from sqlalchemy import String, Integer, Boolean, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.user import User, OrmUser

# Association table for story tags
story_tags = Table(
    "story_tags",
    Base.metadata,
    Column("story_id", Integer, ForeignKey("stories.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True),
)

# Association table for story likes
story_likes = Table(
    "story_likes",
    Base.metadata,
    Column("story_id", Integer, ForeignKey("stories.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)

# Association table for story dislikes
story_dislikes = Table(
    "story_dislikes",
    Base.metadata,
    Column("story_id", Integer, ForeignKey("stories.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)

class OrmTag(Base):
    __tablename__ = "tags"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    
    # Relationship with stories
    stories: Mapped[List["OrmStory"]] = relationship(
        secondary=story_tags, back_populates="tags"
    )

class OrmStory(Base):
    __tablename__ = "stories"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    description: Mapped[str] = mapped_column(String(500))
    content: Mapped[str] = mapped_column(String(10000))
    likes: Mapped[int] = mapped_column(Integer, default=0)  # Net score (likes - dislikes)
    read_count: Mapped[int] = mapped_column(Integer, default=0)
    read_time: Mapped[int] = mapped_column(Integer, default=5)  # in minutes
    category: Mapped[str] = mapped_column(String(50))
    is_interactive: Mapped[bool] = mapped_column(Boolean, default=True)
    age_group: Mapped[str] = mapped_column(String(20), default="all")
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Foreign key relationships
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    # Relationships
    author: Mapped[OrmUser] = relationship("OrmUser")
    tags: Mapped[List[OrmTag]] = relationship(
        secondary=story_tags, back_populates="stories"
    )
    
    # Users who liked this story
    liked_by: Mapped[List[OrmUser]] = relationship(
        "OrmUser",
        secondary=story_likes,
        back_populates="liked_stories"
    )
    
    # Users who disliked this story
    disliked_by: Mapped[List[OrmUser]] = relationship(
        "OrmUser",
        secondary=story_dislikes,
        back_populates="disliked_stories"
    )

logger = logging.getLogger(__name__) # Define logger for use in validator

# --- Pydantic Models ---

# New Page model for structured content
class Page(BaseModel):
    text: Optional[str] = None
    image: Optional[str] = None
    
    class Config:
        from_attributes = True

class TagBase(BaseModel):
    name: str
    
    class Config:
        from_attributes = True

class Tag(TagBase):
    id: int

class AuthorInfo(BaseModel):
    id: int
    username: str
    email: str
    
    class Config:
        from_attributes = True

class StoryBase(BaseModel):
    title: str
    image: Optional[str] = None
    description: str
    category: str
    
    class Config:
        from_attributes = True

class StoryCreate(StoryBase):
    content: List[Page] = []
    is_interactive: bool = True
    age_group: str = "all"
    tags: List[str] = [] 

class StoryList(StoryBase):
    id: int
    likes: int
    category: str
    published_date: datetime = datetime.now(timezone.utc)
    author: User
    
class StoryDetail(StoryList):
    content: List[Page] = []  # Changed from string to list of Page objects
    read_time: int
    read_count: int
    is_interactive: bool
    age_group: str
    tags: List[Tag] = []

    @field_validator('content', mode='before')
    @classmethod
    def deserialize_content_from_json_string(cls, v: any) -> List[dict]:
        if isinstance(v, str):
            if not v:  # Handle empty string as empty list
                return []
            try:
                data = json.loads(v)
                if not isinstance(data, list):
                    logger.warning(f"Story content from DB is not a list: {type(data)}. Value: {v[:100]}")
                    # Decide handling: raise error or attempt to adapt.
                    # For StoryDetail, a list of pages is expected.
                    # If it's a single string not in a list, it's an error for StoryDetail.
                    # The original code in service would wrap it: [Page(text=str(data))]
                    # For a validator, it's cleaner to expect the correct format or fail.
                    raise ValueError("Content JSON from DB must be a list of page objects.")
                
                # Pydantic will then validate each item in the list against the Page model.
                return data # Return the list of dicts for Pydantic to process
            except json.JSONDecodeError as e:
                logger.error(f"Failed to decode story content JSON: {e}. Value: {v[:100]}")
                raise ValueError(f"Invalid JSON in content field: {e}")
        elif isinstance(v, list):
            # If it's already a list (e.g., from internal model creation or tests), pass through.
            return v
        
        # If v is None or other unexpected types, Pydantic will handle the type error,
        # or we can raise a specific error here.
        if v is None:
            return [] # Treat None content as empty list
            
        logger.warning(f"Unexpected type for content field: {type(v)}. Expected str (JSON) or list.")
        # Let Pydantic attempt to validate or fail for other types.
        # Raising a ValueError here might be more explicit.
        raise ValueError(f"Content must be a JSON string or a list of page objects, got {type(v)}")


class StoriesResponse(BaseModel):
    total: int
    stories: List[StoryList]
