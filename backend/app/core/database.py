from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker 
import os
from pathlib import Path
from config import Config
from app.models import Base

DATABASE_URL = Config.DATABASE_URL

# If using SQLite, make sure the database file has proper permissions
if DATABASE_URL.startswith('sqlite'):
    # Extract the database path from the URL (assuming format sqlite+aiosqlite:///./path)
    db_path_str = DATABASE_URL.split(':///')[-1]
    db_path = Path(db_path_str)
    
    # Make sure the directory exists
    os.makedirs(os.path.dirname(os.path.abspath(db_path)) or '.', exist_ok=True)
    
    # Set connect_args appropriately for SQLite
    connect_args = {"check_same_thread": False}
    
    # Check if file is read-only if it exists
    if db_path.exists() and not os.access(db_path, os.W_OK):
        print(f"Warning: Database file {db_path} is not writable. Fixing permissions...")
        os.chmod(db_path, 0o666)  # Make file writable
else:
    connect_args = {}

engine = create_async_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False  # debug için true todo: kaldır
)

async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

metadata = Base.metadata
