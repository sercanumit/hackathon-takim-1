from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from app.models.base import Base

# ORM User sınıfı
class OrmUser(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]
    
    # Stories liked by this user
    liked_stories: Mapped[List["OrmStory"]] = relationship(
        "OrmStory",
        secondary="story_likes",
        back_populates="liked_by"
    )
    
    # Stories disliked by this user
    disliked_stories: Mapped[List["OrmStory"]] = relationship(
        "OrmStory",
        secondary="story_dislikes",
        back_populates="disliked_by"
    )

# --- Pydantic Modelleri ---

class UserBase(BaseModel):
    email: EmailStr
    username: str

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str

# kullanıcı verilerini döndürmek için pydantic modeli (şifre hariç)
class User(UserBase):
    id: int
