from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class PurchaseOrderBase(BaseModel):
    supplier: str
    branch: Optional[str] = None
    order_date: str
    expected_delivery: Optional[str] = None
    status: str = "Draft"
    order_items: Optional[List[Any]] = None
    tax_amount: Optional[float] = 0.0
    shipping_cost: Optional[float] = 0.0
    total_amount: Optional[float] = 0.0
    notes_to_supplier: Optional[str] = None
    internal_notes: Optional[str] = None
    created_by: Optional[str] = None


class PurchaseOrderCreate(PurchaseOrderBase):
    po_number: Optional[str] = None


class PurchaseOrderUpdate(BaseModel):
    po_number: Optional[str] = None
    supplier: Optional[str] = None
    branch: Optional[str] = None
    order_date: Optional[str] = None
    expected_delivery: Optional[str] = None
    status: Optional[str] = None
    order_items: Optional[List[Any]] = None
    tax_amount: Optional[float] = None
    shipping_cost: Optional[float] = None
    total_amount: Optional[float] = None
    notes_to_supplier: Optional[str] = None
    internal_notes: Optional[str] = None
    created_by: Optional[str] = None


class PurchaseOrderResponse(PurchaseOrderBase):
    id: int
    po_number: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
