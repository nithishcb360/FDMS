from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.core.database import Base

class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, index=True)
    movement_id = Column(String, unique=True, index=True, nullable=False)
    product = Column(String, nullable=False)
    product_sku = Column(String, nullable=True)
    branch = Column(String, nullable=False)
    movement_type = Column(String, nullable=False)  # Purchase Receipt, Sale/Usage, Stock Adjustment, Branch Transfer, Supplier Return, Damage/Loss
    direction = Column(String, nullable=False)  # IN or OUT
    quantity = Column(Integer, nullable=False)
    stock_before = Column(Integer, default=0)
    stock_after = Column(Integer, default=0)
    purchase_order = Column(String, nullable=True)
    case_id = Column(String, nullable=True)
    reason = Column(String, nullable=True)
    movement_date = Column(DateTime, default=datetime.utcnow)
    additional_notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)
