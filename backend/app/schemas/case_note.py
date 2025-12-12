from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class CaseNoteBase(BaseModel):
    case_number: str
    note_type: str
    content: str
    requires_follow_up: bool = False
    follow_up_date: Optional[date] = None
    is_private: bool = False
    created_by: str


class CaseNoteCreate(CaseNoteBase):
    pass


class CaseNoteUpdate(BaseModel):
    case_number: Optional[str] = None
    note_type: Optional[str] = None
    content: Optional[str] = None
    requires_follow_up: Optional[bool] = None
    follow_up_date: Optional[date] = None
    is_private: Optional[bool] = None
    created_by: Optional[str] = None


class CaseNoteResponse(CaseNoteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
