from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AssignmentBase(BaseModel):
    case_number: str
    staff_member: str
    role: str
    instructions: Optional[str] = None
    status: str = "Pending"


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentUpdate(BaseModel):
    case_number: Optional[str] = None
    staff_member: Optional[str] = None
    role: Optional[str] = None
    instructions: Optional[str] = None
    status: Optional[str] = None


class AssignmentResponse(AssignmentBase):
    id: int
    assigned_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
