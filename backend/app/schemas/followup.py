from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class FollowupBase(BaseModel):
    family_id: Optional[int] = None
    case_id: Optional[int] = None
    task_type: str
    priority: str = "Normal"
    title: str
    description: str
    assigned_to: Optional[str] = None
    due_date: date
    reminder_date: Optional[date] = None
    status: str = "Pending"
    completed_at: Optional[datetime] = None
    completion_notes: Optional[str] = None

class FollowupCreate(FollowupBase):
    pass

class FollowupUpdate(BaseModel):
    family_id: Optional[int] = None
    case_id: Optional[int] = None
    task_type: Optional[str] = None
    priority: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[date] = None
    reminder_date: Optional[date] = None
    status: Optional[str] = None
    completed_at: Optional[datetime] = None
    completion_notes: Optional[str] = None

class FollowupResponse(FollowupBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
