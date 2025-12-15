from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ArrangementBase(BaseModel):
    case_id: int
    service_package: Optional[str] = None
    service_date: Optional[datetime] = None
    service_time: Optional[str] = None
    duration_minutes: int = 120
    venue: Optional[str] = None
    estimated_attendees: int = 0
    religious_rite: Optional[str] = None
    clergy_name: Optional[str] = None
    clergy_contact: Optional[str] = None
    special_requests: Optional[str] = None
    music_preferences: Optional[str] = None
    eulogy_speakers: Optional[str] = None
    package_customized: bool = False
    customization_notes: Optional[str] = None
    approval_status: str = "Pending Approval"
    is_confirmed: bool = False


class ArrangementCreate(ArrangementBase):
    pass


class ArrangementUpdate(BaseModel):
    case_id: Optional[int] = None
    service_package: Optional[str] = None
    service_date: Optional[datetime] = None
    service_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    venue: Optional[str] = None
    estimated_attendees: Optional[int] = None
    religious_rite: Optional[str] = None
    clergy_name: Optional[str] = None
    clergy_contact: Optional[str] = None
    special_requests: Optional[str] = None
    music_preferences: Optional[str] = None
    eulogy_speakers: Optional[str] = None
    package_customized: Optional[bool] = None
    customization_notes: Optional[str] = None
    approval_status: Optional[str] = None
    is_confirmed: Optional[bool] = None


class ArrangementResponse(ArrangementBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
