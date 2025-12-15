from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class StockMovementBase(BaseModel):
    product: str
    product_sku: Optional[str] = None
    branch: str
    movement_type: str
    direction: str
    quantity: int
    stock_before: int = 0
    stock_after: int = 0
    purchase_order: Optional[str] = None
    case_id: Optional[str] = None
    reason: Optional[str] = None
    movement_date: datetime
    additional_notes: Optional[str] = None

class StockMovementCreate(StockMovementBase):
    pass

class StockMovementUpdate(BaseModel):
    product: Optional[str] = None
    product_sku: Optional[str] = None
    branch: Optional[str] = None
    movement_type: Optional[str] = None
    direction: Optional[str] = None
    quantity: Optional[int] = None
    stock_before: Optional[int] = None
    stock_after: Optional[int] = None
    purchase_order: Optional[str] = None
    case_id: Optional[str] = None
    reason: Optional[str] = None
    movement_date: Optional[datetime] = None
    additional_notes: Optional[str] = None

class StockMovementResponse(StockMovementBase):
    id: int
    movement_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
