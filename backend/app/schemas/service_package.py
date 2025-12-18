from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ServicePackageBase(BaseModel):
    package_name: str
    service_type_id: Optional[int] = None
    description: Optional[str] = None
    package_price: float = 0.0
    included_items: Optional[str] = None
    is_customizable: bool = False
    is_active: bool = True


class ServicePackageCreate(ServicePackageBase):
    pass


class ServicePackageUpdate(BaseModel):
    package_name: Optional[str] = None
    service_type_id: Optional[int] = None
    description: Optional[str] = None
    package_price: Optional[float] = None
    included_items: Optional[str] = None
    is_customizable: Optional[bool] = None
    is_active: Optional[bool] = None


class ServicePackageResponse(ServicePackageBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
