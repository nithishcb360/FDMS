from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)

    # Event Details
    event_type = Column(String(100), nullable=False)  # Reception, Burial, Viewing/Visitation, Preparation, Other Event
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    # Date & Time
    start_datetime = Column(DateTime(timezone=True), nullable=False)
    end_datetime = Column(DateTime(timezone=True), nullable=False)

    # Location
    venue = Column(String(200), nullable=True)
    location_details = Column(Text, nullable=True)

    # Staff & Notes
    assigned_staff = Column(Text, nullable=True)  # Comma-separated staff IDs or names
    notes = Column(Text, nullable=True)
    setup_notes = Column(Text, nullable=True)

    # Status
    confirmation_status = Column(Boolean, default=False)  # True = "Yes, Confirmed", False = "Not Confirmed"

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    case = relationship("Case", backref="schedules")
