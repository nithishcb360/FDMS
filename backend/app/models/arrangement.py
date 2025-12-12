from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Arrangement(Base):
    __tablename__ = "arrangements"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)

    # Basic Information
    service_package = Column(String(100), nullable=True)

    # Schedule Details
    service_date = Column(DateTime(timezone=True), nullable=True)
    service_time = Column(String(10), nullable=True)  # HH:MM format
    duration_minutes = Column(Integer, default=120)

    # Venue
    venue = Column(String(200), nullable=True)
    estimated_attendees = Column(Integer, default=0)

    # Religious Details
    religious_rite = Column(String(100), nullable=True)
    clergy_name = Column(String(200), nullable=True)
    clergy_contact = Column(String(100), nullable=True)

    # Service Preferences
    special_requests = Column(Text, nullable=True)
    music_preferences = Column(Text, nullable=True)
    eulogy_speakers = Column(Text, nullable=True)

    # Customization
    package_customized = Column(Boolean, default=False)
    customization_notes = Column(Text, nullable=True)

    # Status
    approval_status = Column(String(50), default="Pending Approval")  # Pending Approval, Approved, Rejected
    is_confirmed = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    case = relationship("Case", backref="arrangements")
