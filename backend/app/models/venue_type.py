from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.sql import func
from ..core.database import Base


class VenueType(Base):
    __tablename__ = "venue_types"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    venue_type = Column(String(100), nullable=False)  # e.g., "Cemetery", "Chapel", "Church"
    display_name = Column(String(200), nullable=False)
    location = Column(Text, nullable=True)  # Full address or location description

    # Capacity & Pricing
    max_capacity = Column(Integer, default=0)
    hourly_rate = Column(Float, default=0.0)

    # Available Facilities
    has_parking = Column(Boolean, default=False)
    has_catering = Column(Boolean, default=False)
    has_av_equipment = Column(Boolean, default=False)

    # Contact Information
    contact_person = Column(String(200), nullable=True)
    contact_phone = Column(String(50), nullable=True)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
