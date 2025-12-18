from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class TaxCodeBase(BaseModel):
    tax_code: str
    tax_name: str
    country: str = "USA"
    description: Optional[str] = None
    tax_rate: float = 0.0
    applies_to_services: bool = False
    applies_to_products: bool = False
    effective_from: date
    effective_to: Optional[date] = None
    is_active: bool = True


class TaxCodeCreate(TaxCodeBase):
    pass


class TaxCodeUpdate(BaseModel):
    tax_code: Optional[str] = None
    tax_name: Optional[str] = None
    country: Optional[str] = None
    description: Optional[str] = None
    tax_rate: Optional[float] = None
    applies_to_services: Optional[bool] = None
    applies_to_products: Optional[bool] = None
    effective_from: Optional[date] = None
    effective_to: Optional[date] = None
    is_active: Optional[bool] = None


class TaxCodeResponse(TaxCodeBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
