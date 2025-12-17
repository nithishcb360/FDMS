from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class ExpenseBase(BaseModel):
    expense_number: str
    category: str
    branch: Optional[str] = None
    description: str
    amount: float
    expense_date: date
    due_date: Optional[date] = None
    vendor_name: str
    vendor_reference: Optional[str] = None
    payment_method: Optional[str] = None
    check_number: Optional[str] = None
    status: str = "Pending"
    is_tax_deductible: bool = False
    notes: Optional[str] = None

class ExpenseCreate(BaseModel):
    category: str
    branch: Optional[str] = None
    description: str
    amount: float
    expense_date: date
    due_date: Optional[date] = None
    vendor_name: str
    vendor_reference: Optional[str] = None
    payment_method: Optional[str] = None
    check_number: Optional[str] = None
    status: str = "Pending"
    is_tax_deductible: bool = False
    notes: Optional[str] = None

class ExpenseUpdate(BaseModel):
    expense_number: Optional[str] = None
    category: Optional[str] = None
    branch: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    expense_date: Optional[date] = None
    due_date: Optional[date] = None
    vendor_name: Optional[str] = None
    vendor_reference: Optional[str] = None
    payment_method: Optional[str] = None
    check_number: Optional[str] = None
    status: Optional[str] = None
    is_tax_deductible: Optional[bool] = None
    notes: Optional[str] = None

class ExpenseResponse(ExpenseBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
