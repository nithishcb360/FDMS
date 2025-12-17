from sqlalchemy import Column, Integer, String, Text, DateTime, Date, Boolean, Float
from sqlalchemy.sql import func
from app.core.database import Base


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)

    # Personal Information
    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    ssn = Column(String(20), nullable=True)  # Social Security Number

    # Contact Information
    email = Column(String(100), unique=True, nullable=False, index=True)
    primary_phone = Column(String(20), nullable=True)
    secondary_phone = Column(String(20), nullable=True)
    address_line1 = Column(String(200), nullable=True)
    address_line2 = Column(String(200), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(50), nullable=True)
    zip_code = Column(String(20), nullable=True)

    # Emergency Contact
    emergency_contact_name = Column(String(100), nullable=True)
    emergency_contact_relationship = Column(String(100), nullable=True)
    emergency_contact_phone = Column(String(20), nullable=True)

    # Employment Information
    branch = Column(String(100), nullable=True)
    department = Column(String(100), nullable=False)
    position = Column(String(100), nullable=False)
    employment_type = Column(String(50), nullable=False)  # Full-Time, Part-Time, Contract
    status = Column(String(50), default="Active")  # Active, Inactive, On Leave
    hire_date = Column(Date, nullable=False)
    termination_date = Column(Date, nullable=True)

    # Compensation
    hourly_rate = Column(Float, nullable=True)
    annual_salary = Column(Float, nullable=True)

    # Work Preferences
    max_hours_per_week = Column(Integer, nullable=True)
    can_work_weekends = Column(Boolean, default=False)
    can_work_nights = Column(Boolean, default=False)
    can_work_holidays = Column(Boolean, default=False)

    # Performance & Reviews
    performance_rating = Column(Float, nullable=True)  # 0.0 - 5.0
    last_review_date = Column(Date, nullable=True)
    next_review_date = Column(Date, nullable=True)

    # Additional Information
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
