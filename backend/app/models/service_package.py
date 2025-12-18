from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from ..core.database import Base


class ServicePackage(Base):
    __tablename__ = "service_packages"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    package_name = Column(String(200), nullable=False)
    service_type_id = Column(Integer, ForeignKey("service_types.id"), nullable=True)
    description = Column(Text, nullable=True)

    # Pricing
    package_price = Column(Float, default=0.0)

    # Included Items (stored as text, one per line)
    included_items = Column(Text, nullable=True)

    # Settings
    is_customizable = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
