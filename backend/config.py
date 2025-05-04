import os
from dotenv import load_dotenv
import secrets
import string
from pathlib import Path

load_dotenv()

class Config:
    # project base directory
    BASE_DIR = Path(__file__).parent.absolute()
    
    DATABASE_URL = os.getenv(
        "DATABASE_URL", 
        f"sqlite+aiosqlite:///{BASE_DIR / 'app.db'}"
    )

    # JWT settings
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", 
                              "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32)))
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 30))
