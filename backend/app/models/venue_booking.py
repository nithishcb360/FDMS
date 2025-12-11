from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Numeric, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class VenueBooking(Base):
    __tablename__ = "venue_bookings"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    venue = Column(String(200), nullable=False)
    booking_date = Column(DateTime(timezone=True), nullable=False)
    booking_time = Column(String(10), nullable=True)
    duration_hours = Column(Integer, default=2)
    contact_person = Column(String(200), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    contact_email = Column(String(200), nullable=True)
    cost = Column(Numeric(10, 2), default=0.00)
    status = Column(String(50), default="Tentative")  # Tentative, Confirmed, Cancelled
    special_requirements = Column(Text, nullable=True)
    setup_notes = Column(Text, nullable=True)
    is_paid = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    case = relationship("Case", back_populates="venue_bookings")
