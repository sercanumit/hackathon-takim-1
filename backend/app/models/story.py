from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
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

# --- Pydantic Models ---

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
    content: str
    is_interactive: bool = True
    age_group: str = "all"
    tags: List[str] = [] 

class StoryList(StoryBase):
    id: int
    likes: int
    category: str
    published_date: datetime = datetime.utcnow()
    author: User
    
class StoryDetail(StoryList):
    content: str
    read_time: int
    read_count: int
    is_interactive: bool
    age_group: str
    tags: List[Tag] = []

class StoriesResponse(BaseModel):
    total: int
    stories: List[StoryList]
