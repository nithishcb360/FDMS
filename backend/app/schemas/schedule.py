from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional


class ScheduleBase(BaseModel):
    staff_member_id: int
    staff_member_name: str
    shift_date: date
    shift_type: str
    status: str = "Scheduled"
    start_time: time
    end_time: time
    break_duration: Optional[int] = 30
    is_overtime: bool = False
    is_holiday: bool = False
    notes: Optional[str] = None


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    staff_member_id: Optional[int] = None
    staff_member_name: Optional[str] = None
    shift_date: Optional[date] = None
    shift_type: Optional[str] = None
    status: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    break_duration: Optional[int] = None
    is_overtime: Optional[bool] = None
    is_holiday: Optional[bool] = None
    notes: Optional[str] = None


class ScheduleResponse(ScheduleBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
