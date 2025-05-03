from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker 
from config import Config
from app.models import Base

DATABASE_URL = Config.DATABASE_URL

engine = create_async_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}, #
    echo=True # debug için true todo: kaldır
)

async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

metadata = Base.metadata
