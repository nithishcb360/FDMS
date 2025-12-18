from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class VenueTypeBase(BaseModel):
    venue_type: str
    display_name: str
    location: Optional[str] = None
    max_capacity: int = 0
    hourly_rate: float = 0.0
    has_parking: bool = False
    has_catering: bool = False
    has_av_equipment: bool = False
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    is_active: bool = True


class VenueTypeCreate(VenueTypeBase):
    pass


class VenueTypeUpdate(BaseModel):
    venue_type: Optional[str] = None
    display_name: Optional[str] = None
    location: Optional[str] = None
    max_capacity: Optional[int] = None
    hourly_rate: Optional[float] = None
    has_parking: Optional[bool] = None
    has_catering: Optional[bool] = None
    has_av_equipment: Optional[bool] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    is_active: Optional[bool] = None


class VenueTypeResponse(VenueTypeBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
