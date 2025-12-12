from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(50), unique=True, index=True, nullable=False)

    # Deceased Information
    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=False)
    photo_url = Column(String(500), nullable=True)
    gender = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    date_of_death = Column(Date, nullable=False)
    place_of_death = Column(String(200), nullable=False)
    cause_of_death = Column(Text, nullable=True)

    # Case Information
    branch = Column(String(100), nullable=False)
    service_type = Column(String(100), nullable=True)
    priority = Column(String(50), default="Normal")
    status = Column(String(50), default="Intake")
    internal_notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    venue_bookings = relationship("VenueBooking", back_populates="case")
