from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class TimeLogBase(BaseModel):
    staff_member_id: int
    staff_member_name: str
    log_date: date
    log_type: str
    related_schedule_id: Optional[int] = None
    clock_in: datetime
    clock_out: Optional[datetime] = None
    break_duration: Optional[int] = 0
    hours_worked: float = 0.0
    status: str = "Pending Approval"
    hourly_rate: Optional[float] = None
    total_pay: Optional[float] = None
    is_overtime: bool = False
    is_holiday_pay: bool = False
    notes: Optional[str] = None


class TimeLogCreate(TimeLogBase):
    pass


class TimeLogUpdate(BaseModel):
    staff_member_id: Optional[int] = None
    staff_member_name: Optional[str] = None
    log_date: Optional[date] = None
    log_type: Optional[str] = None
    related_schedule_id: Optional[int] = None
    clock_in: Optional[datetime] = None
    clock_out: Optional[datetime] = None
    break_duration: Optional[int] = None
    hours_worked: Optional[float] = None
    status: Optional[str] = None
    hourly_rate: Optional[float] = None
    total_pay: Optional[float] = None
    is_overtime: Optional[bool] = None
    is_holiday_pay: Optional[bool] = None
    notes: Optional[str] = None


class TimeLogResponse(TimeLogBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
