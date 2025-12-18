from sqlalchemy import Column, Integer, String, Text, Date, Float, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class Preneed(Base):
    __tablename__ = "preneeds"

    id = Column(Integer, primary_key=True, index=True)
    family_id = Column(Integer, nullable=True)
    plan_holder_name = Column(String(200), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    relationship_to_primary = Column(String(100), nullable=True)
    service_type = Column(String(100), nullable=False)  # Burial, Cremation, etc.
    package = Column(String(100), nullable=False)
    service_preferences = Column(JSON, nullable=True)  # JSON array/object
    estimated_cost = Column(Float, nullable=False)
    amount_paid = Column(Float, nullable=False, default=0.0)
    payment_plan = Column(String(100), nullable=False)  # Full Payment, Monthly, Quarterly, etc.
    status = Column(String(50), nullable=False, default="Active")  # Active, Completed, Cancelled
    contract_document = Column(String(500), nullable=True)  # File path
    special_instructions = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
