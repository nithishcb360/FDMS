from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from ..core.database import Base

class Communication(Base):
    __tablename__ = "communications"

    id = Column(Integer, primary_key=True, index=True)

    # Communication Details
    family_id = Column(Integer, nullable=True)
    family_name = Column(String(200), nullable=True)
    case_id = Column(Integer, nullable=True)
    case_number = Column(String(100), nullable=True)
    type = Column(String(100), nullable=False)  # Email, Phone, SMS, Meeting, Letter
    direction = Column(String(50), nullable=False)  # Inbound, Outbound
    status = Column(String(50), nullable=False, default="Sent")  # Sent, Delivered, Failed, Pending

    # Message Content
    subject = Column(String(500), nullable=True)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=True)

    # Attachments
    has_attachments = Column(Boolean, default=False)
    attachment_count = Column(Integer, default=0)

    # Communication Date
    communication_date = Column(DateTime(timezone=True), server_default=func.now())

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
