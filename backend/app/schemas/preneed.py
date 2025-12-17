from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, Any

class PreneedBase(BaseModel):
    family_id: Optional[int] = None
    plan_holder_name: str
    date_of_birth: date
    relationship_to_primary: Optional[str] = None
    service_type: str
    package: str
    service_preferences: Optional[Any] = None
    estimated_cost: float
    amount_paid: float = 0.0
    payment_plan: str
    status: str = "Active"
    contract_document: Optional[str] = None
    special_instructions: Optional[str] = None
    notes: Optional[str] = None

class PreneedCreate(PreneedBase):
    pass

class PreneedUpdate(BaseModel):
    family_id: Optional[int] = None
    plan_holder_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    relationship_to_primary: Optional[str] = None
    service_type: Optional[str] = None
    package: Optional[str] = None
    service_preferences: Optional[Any] = None
    estimated_cost: Optional[float] = None
    amount_paid: Optional[float] = None
    payment_plan: Optional[str] = None
    status: Optional[str] = None
    contract_document: Optional[str] = None
    special_instructions: Optional[str] = None
    notes: Optional[str] = None

class PreneedResponse(PreneedBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
