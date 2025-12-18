from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.core.database import Base

class TimeLog(Base):
    __tablename__ = "time_logs"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    staff_member_id = Column(Integer, nullable=False)
    staff_member_name = Column(String(200), nullable=False)
    log_date = Column(Date, nullable=False)
    log_type = Column(String(100), nullable=False)
    related_schedule_id = Column(Integer, nullable=True)

    # Time Tracking
    clock_in = Column(DateTime, nullable=False)
    clock_out = Column(DateTime, nullable=True)
    break_duration = Column(Integer, nullable=True, default=0)  # in minutes
    hours_worked = Column(Float, nullable=False, default=0.0)
    status = Column(String(50), nullable=False, default="Pending Approval")

    # Pay & Compensation
    hourly_rate = Column(Float, nullable=True)
    total_pay = Column(Float, nullable=True)
    is_overtime = Column(Boolean, default=False)
    is_holiday_pay = Column(Boolean, default=False)

    # Additional Notes
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
