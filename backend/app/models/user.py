from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

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
