from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BranchBase(BaseModel):
    branch_name: str
    branch_code: str
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: str = "USA"
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    tax_id: Optional[str] = None
    license_number: Optional[str] = None
    is_active: bool = True


class BranchCreate(BranchBase):
    pass


class BranchUpdate(BaseModel):
    branch_name: Optional[str] = None
    branch_code: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    tax_id: Optional[str] = None
    license_number: Optional[str] = None
    is_active: Optional[bool] = None


class BranchResponse(BranchBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
