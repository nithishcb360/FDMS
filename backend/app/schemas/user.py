from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role_id: Optional[int] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    role_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None


class UserWithRole(UserResponse):
    role_name: Optional[str] = None
    role_display_name: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
