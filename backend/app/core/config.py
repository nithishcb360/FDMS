# from pydantic_settings import BaseSettings
# from typing import List


# class Settings(BaseSettings):
#     DATABASE_URL: str
#     SECRET_KEY: str = "your-secret-key-change-in-production"
#     BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

#     class Config:
#         env_file = ".env"
#         case_sensitive = True


# settings = Settings()
# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Safe local fallback for development only:
    DATABASE_URL: str = "sqlite:///./dev.db"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Helpful message for developers only
if os.environ.get("DATABASE_URL") is None and not os.path.exists(".env"):
    print("WARNING: DATABASE_URL not set; using sqlite dev fallback (sqlite:///./dev.db).")
    print("Create a .env file or set DATABASE_URL in the env for production.")
