import os
from dotenv import load_dotenv
import secrets
import string

load_dotenv()

class Config:
    # JWT settings
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", 
                              "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32)))
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 30))
