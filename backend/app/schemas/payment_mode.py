from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PaymentModeBase(BaseModel):
    payment_method: str
    display_name: str
    payment_type: str
    description: Optional[str] = None
    has_processing_fee: bool = False
    percentage_fee: float = 0
    fixed_fee: float = 0
    is_online: bool = False
    requires_authorization: bool = False
    is_active: bool = True


class PaymentModeCreate(PaymentModeBase):
    pass


class PaymentModeUpdate(BaseModel):
    payment_method: Optional[str] = None
    display_name: Optional[str] = None
    payment_type: Optional[str] = None
    description: Optional[str] = None
    has_processing_fee: Optional[bool] = None
    percentage_fee: Optional[float] = None
    fixed_fee: Optional[float] = None
    is_online: Optional[bool] = None
    requires_authorization: Optional[bool] = None
    is_active: Optional[bool] = None


class PaymentModeResponse(PaymentModeBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
