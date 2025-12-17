from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean
from sqlalchemy.sql import func
from ..core.database import Base

class Followup(Base):
    __tablename__ = "followups"

    id = Column(Integer, primary_key=True, index=True)
    family_id = Column(Integer, nullable=True)
    case_id = Column(Integer, nullable=True)
    task_type = Column(String(100), nullable=False)  # Phone Call, Email, Meeting, Document Review, etc.
    priority = Column(String(50), nullable=False, default="Normal")  # Low, Normal, High, Urgent
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    assigned_to = Column(String(200), nullable=True)
    due_date = Column(Date, nullable=False)
    reminder_date = Column(Date, nullable=True)
    status = Column(String(50), nullable=False, default="Pending")  # Pending, Overdue, Completed
    completed_at = Column(DateTime, nullable=True)
    completion_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
