from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TransactionBase(BaseModel):
    transaction_id: str
    transaction_type: str
    category: str
    amount: float
    transaction_date: date
    description: str
    invoice_id: Optional[int] = None
    payment_id: Optional[int] = None
    reference_number: Optional[str] = None
    account_name: Optional[str] = None
    branch: Optional[str] = None
    notes: Optional[str] = None

class TransactionCreate(BaseModel):
    transaction_type: str
    category: str
    amount: float
    transaction_date: date
    description: str
    invoice_id: Optional[int] = None
    payment_id: Optional[int] = None
    reference_number: Optional[str] = None
    account_name: Optional[str] = None
    branch: Optional[str] = None
    notes: Optional[str] = None

class TransactionUpdate(BaseModel):
    transaction_type: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    transaction_date: Optional[date] = None
    description: Optional[str] = None
    invoice_id: Optional[int] = None
    payment_id: Optional[int] = None
    reference_number: Optional[str] = None
    account_name: Optional[str] = None
    branch: Optional[str] = None
    notes: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
