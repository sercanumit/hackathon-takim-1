from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
# datetime ve func importlarını ekleyin
from sqlalchemy import func
from datetime import datetime
from typing import Optional


class Base(DeclarativeBase):
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now(), nullable=False
    )

# ORM User sınıfı
class OrmUser(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]

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

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
