from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class ServiceAddon(Base):
    __tablename__ = "service_addons"

    id = Column(Integer, primary_key=True, index=True)
    # Basic Information
    name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    # Pricing & Units
    unit_price = Column(Numeric(10, 2), default=0.00)
    unit_of_measure = Column(String(50), nullable=True)  # e.g., "Each", "Dozen", "Hour"
    tax_applicable = Column(Boolean, default=False)

    # Inventory Management
    requires_inventory_check = Column(Boolean, default=False)
    current_stock_quantity = Column(Integer, default=0)
    minimum_stock_level = Column(Integer, default=0)

    # Supplier Information
    supplier_name = Column(String(200), nullable=True)
    supplier_contact = Column(String(200), nullable=True)
    supplier_notes = Column(Text, nullable=True)

    # Additional Settings
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
