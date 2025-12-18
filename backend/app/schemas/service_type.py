from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ServiceTypeBase(BaseModel):
    service_type: str
    display_name: str
    description: Optional[str] = None
    base_price: float = 0.0
    estimated_duration: int = 2
    requires_venue: bool = False
    requires_vehicle: bool = False
    is_active: bool = True


class ServiceTypeCreate(ServiceTypeBase):
    pass


class ServiceTypeUpdate(BaseModel):
    service_type: Optional[str] = None
    display_name: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    estimated_duration: Optional[int] = None
    requires_venue: Optional[bool] = None
    requires_vehicle: Optional[bool] = None
    is_active: Optional[bool] = None


class ServiceTypeResponse(ServiceTypeBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
