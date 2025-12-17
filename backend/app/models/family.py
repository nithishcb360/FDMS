from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from sqlalchemy.sql import func
from ..core.database import Base

class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    family_id = Column(String(100), unique=True, nullable=False)

    # Primary Contact
    primary_contact_name = Column(String(200), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(200), nullable=False)

    # Address
    street_address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    zip_code = Column(String(20), nullable=False)
    country = Column(String(100), nullable=True, default="USA")

    # Preferences
    preferred_language = Column(String(50), nullable=True, default="English")
    communication_preference = Column(String(50), nullable=True, default="Email")

    # Additional Information
    tags = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)

    # Metrics
    total_cases = Column(Integer, nullable=False, default=0)
    lifetime_value = Column(Float, nullable=False, default=0.0)
    status = Column(String(50), nullable=False, default="Active")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
