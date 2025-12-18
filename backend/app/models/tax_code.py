from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Date
from sqlalchemy.sql import func
from ..core.database import Base


class TaxCode(Base):
    __tablename__ = "tax_codes"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    tax_code = Column(String(50), unique=True, nullable=False)  # e.g., "TAX-EXEMPT", "TAX-FED"
    tax_name = Column(String(200), nullable=False)
    country = Column(String(100), nullable=False, default="USA")
    description = Column(Text, nullable=True)

    # Tax Rate
    tax_rate = Column(Float, default=0.0)  # Stored as percentage (e.g., 5.00 for 5%)

    # Applicability
    applies_to_services = Column(Boolean, default=False)
    applies_to_products = Column(Boolean, default=False)

    # Effective Period
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date, nullable=True)  # Null means no end date

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
