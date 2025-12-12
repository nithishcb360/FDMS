from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(50), ForeignKey("cases.case_number"), nullable=False, index=True)

    # Staff Information
    staff_member = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)  # Funeral Director, Embalmer, etc.

    # Assignment Details
    instructions = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")  # Pending, Completed

    # Timestamps
    assigned_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
