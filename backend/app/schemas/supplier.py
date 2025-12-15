from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SupplierBase(BaseModel):
    supplier_name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    tax_id: Optional[str] = None
    credit_limit: Optional[float] = 0.0
    categories_supplied: Optional[str] = None
    rating: Optional[float] = 0.0
    delivery_reliability: Optional[float] = 0.0
    status: str = "Active"
    payment_terms: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None


class SupplierCreate(SupplierBase):
    supplier_id: Optional[str] = None


class SupplierUpdate(BaseModel):
    supplier_id: Optional[str] = None
    supplier_name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    tax_id: Optional[str] = None
    credit_limit: Optional[float] = None
    categories_supplied: Optional[str] = None
    rating: Optional[float] = None
    delivery_reliability: Optional[float] = None
    status: Optional[str] = None
    payment_terms: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None


class SupplierResponse(SupplierBase):
    id: int
    supplier_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
