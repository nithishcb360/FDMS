from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from ..core.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(String, unique=True, index=True, nullable=False)
    supplier_name = Column(String, nullable=False)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    fax = Column(String, nullable=True)
    location = Column(String, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)
    country = Column(String, nullable=True)
    tax_id = Column(String, nullable=True)
    credit_limit = Column(Float, default=0.0)
    categories_supplied = Column(String, nullable=True)  # Stored as comma-separated values
    rating = Column(Float, default=0.0)
    delivery_reliability = Column(Float, default=0.0)
    status = Column(String, default="Active")
    payment_terms = Column(String, nullable=True)
    website = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
