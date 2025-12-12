from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class NextOfKinBase(BaseModel):
    case_number: str
    first_name: str
    last_name: str
    relationship: str
    phone: str
    email: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    is_primary_contact: bool = False
    is_authorized_decision_maker: bool = False
    receive_notifications: bool = False
    notes: Optional[str] = None


class NextOfKinCreate(NextOfKinBase):
    pass


class NextOfKinUpdate(BaseModel):
    case_number: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    relationship: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    is_primary_contact: Optional[bool] = None
    is_authorized_decision_maker: Optional[bool] = None
    receive_notifications: Optional[bool] = None
    notes: Optional[str] = None


class NextOfKinResponse(NextOfKinBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
