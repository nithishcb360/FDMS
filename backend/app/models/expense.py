from sqlalchemy import Column, Integer, String, Float, Date, Text, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    expense_number = Column(String(100), unique=True, nullable=False)

    # Basic Information
    category = Column(String(100), nullable=False)
    branch = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)
    expense_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=True)

    # Vendor Information
    vendor_name = Column(String(200), nullable=False)
    vendor_reference = Column(String(200), nullable=True)

    # Payment Details
    payment_method = Column(String(100), nullable=True)
    check_number = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False, default="Pending")
    is_tax_deductible = Column(Boolean, default=False)

    # Additional Information
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
