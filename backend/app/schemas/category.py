from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryBase(BaseModel):
    category_id: str
    category_name: str
    category_type: str
    parent_category: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = 0
    status: str = "Active"


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    category_type: Optional[str] = None
    parent_category: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None
    status: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
