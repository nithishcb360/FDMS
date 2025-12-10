from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class CaseBase(BaseModel):
    # Deceased Information
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    photo_url: Optional[str] = None
    gender: Optional[str] = "Unknown"
    date_of_birth: Optional[date] = None
    date_of_death: date
    place_of_death: str
    cause_of_death: Optional[str] = None

    # Case Information
    branch: str
    service_type: Optional[str] = None
    priority: str = "Normal"
    status: str = "Intake"
    internal_notes: Optional[str] = None


class CaseCreate(CaseBase):
    pass


class CaseUpdate(BaseModel):
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    photo_url: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    date_of_death: Optional[date] = None
    place_of_death: Optional[str] = None
    cause_of_death: Optional[str] = None
    branch: Optional[str] = None
    service_type: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    internal_notes: Optional[str] = None


class CaseResponse(CaseBase):
    id: int
    case_number: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
