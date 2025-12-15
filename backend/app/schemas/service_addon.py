from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import datetime


class ServiceAddonBase(BaseModel):
    # Basic Information
    name: str
    category: Optional[str] = None
    description: Optional[str] = None

    # Pricing & Units
    unit_price: Optional[condecimal(max_digits=10, decimal_places=2)] = 0.00
    unit_of_measure: Optional[str] = None
    tax_applicable: Optional[bool] = False

    # Inventory Management
    requires_inventory_check: Optional[bool] = False
    current_stock_quantity: Optional[int] = 0
    minimum_stock_level: Optional[int] = 0

    # Supplier Information
    supplier_name: Optional[str] = None
    supplier_contact: Optional[str] = None
    supplier_notes: Optional[str] = None

    # Additional Settings
    display_order: Optional[int] = 0
    is_active: Optional[bool] = True


class ServiceAddonCreate(ServiceAddonBase):
    pass


class ServiceAddonUpdate(BaseModel):
    # Basic Information
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None

    # Pricing & Units
    unit_price: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    unit_of_measure: Optional[str] = None
    tax_applicable: Optional[bool] = None

    # Inventory Management
    requires_inventory_check: Optional[bool] = None
    current_stock_quantity: Optional[int] = None
    minimum_stock_level: Optional[int] = None

    # Supplier Information
    supplier_name: Optional[str] = None
    supplier_contact: Optional[str] = None
    supplier_notes: Optional[str] = None

    # Additional Settings
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class ServiceAddonResponse(ServiceAddonBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
