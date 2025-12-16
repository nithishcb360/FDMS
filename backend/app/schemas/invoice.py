from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class InvoiceBase(BaseModel):
    invoice_number: str
    client_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    billing_address: Optional[str] = None
    branch: Optional[str] = None
    case_reference: Optional[str] = None
    service_reference: Optional[str] = None
    invoice_date: date
    due_date: date
    status: str = "Draft"
    subtotal: float = 0.0
    tax_amount: float = 0.0
    discount_amount: float = 0.0
    total_amount: float = 0.0
    paid_amount: float = 0.0
    balance: float = 0.0
    payment_terms: Optional[str] = None
    internal_notes: Optional[str] = None
    client_notes: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    invoice_number: Optional[str] = None
    client_name: Optional[str] = None
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    billing_address: Optional[str] = None
    branch: Optional[str] = None
    case_reference: Optional[str] = None
    service_reference: Optional[str] = None
    invoice_date: Optional[date] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    subtotal: Optional[float] = None
    tax_amount: Optional[float] = None
    discount_amount: Optional[float] = None
    total_amount: Optional[float] = None
    paid_amount: Optional[float] = None
    balance: Optional[float] = None
    payment_terms: Optional[str] = None
    internal_notes: Optional[str] = None
    client_notes: Optional[str] = None

class InvoiceResponse(InvoiceBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
