from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from sqlalchemy.sql import func
from ..core.database import Base


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String, unique=True, index=True, nullable=False)
    supplier = Column(String, nullable=False)
    branch = Column(String, nullable=True)
    order_date = Column(String, nullable=False)
    expected_delivery = Column(String, nullable=True)
    status = Column(String, default="Draft")  # Draft, Pending, Approved, Received, Cancelled
    order_items = Column(JSON, nullable=True)  # Array of {product, quantity, unit_price, notes}
    tax_amount = Column(Float, default=0.0)
    shipping_cost = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    notes_to_supplier = Column(Text, nullable=True)
    internal_notes = Column(Text, nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
