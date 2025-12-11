from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ScheduleBase(BaseModel):
    case_id: int
    event_type: str
    title: str
    description: Optional[str] = None
    start_datetime: datetime
    end_datetime: datetime
    venue: Optional[str] = None
    location_details: Optional[str] = None
    assigned_staff: Optional[str] = None
    notes: Optional[str] = None
    setup_notes: Optional[str] = None
    confirmation_status: bool = False


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    case_id: Optional[int] = None
    event_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    venue: Optional[str] = None
    location_details: Optional[str] = None
    assigned_staff: Optional[str] = None
    notes: Optional[str] = None
    setup_notes: Optional[str] = None
    confirmation_status: Optional[bool] = None


class ScheduleResponse(ScheduleBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
