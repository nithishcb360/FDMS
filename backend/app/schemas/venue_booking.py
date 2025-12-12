from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import datetime


class VenueBookingBase(BaseModel):
    case_id: int
    venue: str
    booking_date: datetime
    booking_time: Optional[str] = None
    duration_hours: Optional[int] = 2
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    cost: Optional[condecimal(max_digits=10, decimal_places=2)] = 0.00
    status: Optional[str] = "Tentative"
    special_requirements: Optional[str] = None
    setup_notes: Optional[str] = None
    is_paid: Optional[bool] = False


class VenueBookingCreate(VenueBookingBase):
    pass


class VenueBookingUpdate(BaseModel):
    case_id: Optional[int] = None
    venue: Optional[str] = None
    booking_date: Optional[datetime] = None
    booking_time: Optional[str] = None
    duration_hours: Optional[int] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    cost: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    status: Optional[str] = None
    special_requirements: Optional[str] = None
    setup_notes: Optional[str] = None
    is_paid: Optional[bool] = None


class VenueBookingResponse(VenueBookingBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
