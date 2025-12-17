from sqlalchemy import Column, Integer, String, Text, DateTime, Date, Boolean, Float
from sqlalchemy.sql import func
from app.core.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    priority = Column(String(50), nullable=False, default="Medium Priority")  # Low, Medium, High, Urgent
    status = Column(String(50), nullable=False, default="Pending")  # Pending, In Progress, Completed, Cancelled

    # Reference Information
    case_reference = Column(String(100), nullable=True)
    client_reference = Column(String(100), nullable=True)
    branch = Column(String(100), nullable=True)

    # Timing & Effort
    due_date = Column(Date, nullable=False)
    due_time = Column(String(10), nullable=True)  # Optional specific time (HH:MM format)
    estimated_hours = Column(Float, nullable=True)
    actual_hours = Column(Float, nullable=True)

    # Supervision
    supervisor = Column(String(100), nullable=True)
    supervision_required = Column(Boolean, default=False)

    # Additional Notes
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
