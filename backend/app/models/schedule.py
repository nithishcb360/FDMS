from sqlalchemy import Column, Integer, String, Date, Time, Boolean, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Schedule(Base):
    __tablename__ = "staff_schedules"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    staff_member_id = Column(Integer, nullable=False)  # Reference to staff member
    staff_member_name = Column(String(200), nullable=False)  # Stored for display
    shift_date = Column(Date, nullable=False)
    shift_type = Column(String(50), nullable=False)  # Day Shift, Evening Shift, Night Shift, On-Call, Split Shift
    status = Column(String(50), nullable=False, default="Scheduled")  # Scheduled, Confirmed, Completed, Cancelled, No Show

    # Timing
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    break_duration = Column(Integer, nullable=True, default=30)  # in minutes

    # Special Designations
    is_overtime = Column(Boolean, default=False)
    is_holiday = Column(Boolean, default=False)

    # Additional Notes
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
