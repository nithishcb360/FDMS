from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class PaymentBase(BaseModel):
    payment_number: str
    invoice_id: Optional[int] = None
    invoice_number: Optional[str] = None
    payer_name: str
    payment_method: str
    amount: float
    payment_date: date
    reference_number: Optional[str] = None
    status: str = "Pending"
    notes: Optional[str] = None

class PaymentCreate(BaseModel):
    invoice_id: Optional[int] = None
    invoice_number: Optional[str] = None
    payer_name: str
    payment_method: str
    amount: float
    payment_date: date
    reference_number: Optional[str] = None
    status: str = "Pending"
    notes: Optional[str] = None

class PaymentUpdate(BaseModel):
    payment_number: Optional[str] = None
    invoice_id: Optional[int] = None
    invoice_number: Optional[str] = None
    payer_name: Optional[str] = None
    payment_method: Optional[str] = None
    amount: Optional[float] = None
    payment_date: Optional[date] = None
    reference_number: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
