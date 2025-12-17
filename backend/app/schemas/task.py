from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class TaskBase(BaseModel):
    # Basic Information
    title: str
    description: str
    category: str
    priority: str = "Medium Priority"
    status: str = "Pending"

    # Reference Information
    case_reference: Optional[str] = None
    client_reference: Optional[str] = None
    branch: Optional[str] = None

    # Timing & Effort
    due_date: date
    due_time: Optional[str] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None

    # Supervision
    supervisor: Optional[str] = None
    supervision_required: bool = False

    # Additional Notes
    notes: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    # Basic Information
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None

    # Reference Information
    case_reference: Optional[str] = None
    client_reference: Optional[str] = None
    branch: Optional[str] = None

    # Timing & Effort
    due_date: Optional[date] = None
    due_time: Optional[str] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None

    # Supervision
    supervisor: Optional[str] = None
    supervision_required: Optional[bool] = None

    # Additional Notes
    notes: Optional[str] = None


class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
