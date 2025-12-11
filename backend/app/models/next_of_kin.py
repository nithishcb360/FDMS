from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class NextOfKin(Base):
    __tablename__ = "next_of_kin"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(50), ForeignKey("cases.case_number"), nullable=False)

    # Personal Information
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    relationship = Column(String(50), nullable=False)

    # Contact Information
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)

    # Address Information
    street_address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(50), nullable=True)
    zip_code = Column(String(20), nullable=True)

    # Authorization & Preferences
    is_primary_contact = Column(Boolean, default=False)
    is_authorized_decision_maker = Column(Boolean, default=False)
    receive_notifications = Column(Boolean, default=False)

    # Additional Information
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
