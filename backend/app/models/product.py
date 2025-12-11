from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, unique=True, index=True, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False)
    product_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    product_type = Column(String)
    stock = Column(Integer, default=0)
    cost_price = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    status = Column(String, default="Active")
    unit = Column(String, default="EACH")
    description = Column(String)
    supplier = Column(String)
    reorder_level = Column(Integer, default=5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
