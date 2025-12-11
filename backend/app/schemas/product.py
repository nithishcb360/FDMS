from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    product_id: str
    sku: str
    product_name: str
    category: str
    product_type: Optional[str] = None
    stock: int = 0
    cost_price: float
    selling_price: float
    status: str = "Active"
    unit: Optional[str] = "EACH"
    description: Optional[str] = None
    supplier: Optional[str] = None
    reorder_level: Optional[int] = 5


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    product_id: Optional[str] = None
    sku: Optional[str] = None
    product_name: Optional[str] = None
    category: Optional[str] = None
    product_type: Optional[str] = None
    stock: Optional[int] = None
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    status: Optional[str] = None
    unit: Optional[str] = None
    description: Optional[str] = None
    supplier: Optional[str] = None
    reorder_level: Optional[int] = None


class ProductResponse(ProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
