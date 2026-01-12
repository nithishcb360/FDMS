from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TabSettingBase(BaseModel):
    name: str
    label: str
    path: Optional[str] = None
    parent: Optional[str] = None
    icon: Optional[str] = None
    is_enabled: bool = True
    sort_order: int = 0


class TabSettingCreate(TabSettingBase):
    pass


class TabSettingUpdate(BaseModel):
    label: Optional[str] = None
    path: Optional[str] = None
    parent: Optional[str] = None
    icon: Optional[str] = None
    is_enabled: Optional[bool] = None
    sort_order: Optional[int] = None


class TabSettingResponse(TabSettingBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
