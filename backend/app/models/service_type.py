from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.sql import func
from ..core.database import Base


class ServiceType(Base):
    __tablename__ = "service_types"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    service_type = Column(String(100), nullable=False)  # e.g., "Burial", "Cremation"
    display_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    # Pricing & Duration
    base_price = Column(Float, default=0.0)
    estimated_duration = Column(Integer, default=2)  # in hours

    # Service Requirements
    requires_venue = Column(Boolean, default=False)
    requires_vehicle = Column(Boolean, default=False)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
