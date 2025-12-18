from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReligiousRiteBase(BaseModel):
    religion: str
    rite_name: str
    description: Optional[str] = None
    duration_minutes: int = 60
    special_requirements: Optional[str] = None
    is_active: bool = True


class ReligiousRiteCreate(ReligiousRiteBase):
    pass


class ReligiousRiteUpdate(BaseModel):
    religion: Optional[str] = None
    rite_name: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    special_requirements: Optional[str] = None
    is_active: Optional[bool] = None


class ReligiousRiteResponse(ReligiousRiteBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
