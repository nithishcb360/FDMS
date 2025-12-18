from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date


class StaffBase(BaseModel):
    # Personal Information
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    date_of_birth: Optional[date] = None
    ssn: Optional[str] = None

    # Contact Information
    email: EmailStr
    primary_phone: Optional[str] = None
    secondary_phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None

    # Emergency Contact
    emergency_contact_name: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

    # Employment Information
    branch: Optional[str] = None
    department: str
    position: str
    employment_type: str
    status: str = "Active"
    hire_date: date
    termination_date: Optional[date] = None

    # Compensation
    hourly_rate: Optional[float] = None
    annual_salary: Optional[float] = None

    # Work Preferences
    max_hours_per_week: Optional[int] = None
    can_work_weekends: bool = False
    can_work_nights: bool = False
    can_work_holidays: bool = False

    # Performance & Reviews
    performance_rating: Optional[float] = None
    last_review_date: Optional[date] = None
    next_review_date: Optional[date] = None

    # Additional Information
    notes: Optional[str] = None
    is_active: bool = True


class StaffCreate(StaffBase):
    pass


class StaffUpdate(BaseModel):
    # Personal Information
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    ssn: Optional[str] = None

    # Contact Information
    email: Optional[EmailStr] = None
    primary_phone: Optional[str] = None
    secondary_phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None

    # Emergency Contact
    emergency_contact_name: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

    # Employment Information
    branch: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    employment_type: Optional[str] = None
    status: Optional[str] = None
    hire_date: Optional[date] = None
    termination_date: Optional[date] = None

    # Compensation
    hourly_rate: Optional[float] = None
    annual_salary: Optional[float] = None

    # Work Preferences
    max_hours_per_week: Optional[int] = None
    can_work_weekends: Optional[bool] = None
    can_work_nights: Optional[bool] = None
    can_work_holidays: Optional[bool] = None

    # Performance & Reviews
    performance_rating: Optional[float] = None
    last_review_date: Optional[date] = None
    next_review_date: Optional[date] = None

    # Additional Information
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class StaffResponse(StaffBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
