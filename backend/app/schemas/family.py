from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FamilyBase(BaseModel):
    family_id: str
    primary_contact_name: str
    phone: str
    email: str
    street_address: str
    city: str
    state: str
    zip_code: str
    country: Optional[str] = "USA"
    preferred_language: Optional[str] = "English"
    communication_preference: Optional[str] = "Email"
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    total_cases: int = 0
    lifetime_value: float = 0.0
    status: str = "Active"

class FamilyCreate(BaseModel):
    primary_contact_name: str
    phone: str
    email: str
    street_address: str
    city: str
    state: str
    zip_code: str
    country: Optional[str] = "USA"
    preferred_language: Optional[str] = "English"
    communication_preference: Optional[str] = "Email"
    tags: Optional[List[str]] = None
    notes: Optional[str] = None

class FamilyUpdate(BaseModel):
    primary_contact_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    preferred_language: Optional[str] = None
    communication_preference: Optional[str] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    total_cases: Optional[int] = None
    lifetime_value: Optional[float] = None
    status: Optional[str] = None

class FamilyResponse(FamilyBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
