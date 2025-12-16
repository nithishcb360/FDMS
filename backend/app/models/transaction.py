from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, Boolean
from sqlalchemy.sql import func
from ..core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(100), unique=True, nullable=False)
    transaction_type = Column(String(50), nullable=False)  # Income, Expense
    category = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    transaction_date = Column(Date, nullable=False)
    description = Column(Text, nullable=False)

    # Reference Information
    invoice_id = Column(Integer, nullable=True)
    payment_id = Column(Integer, nullable=True)
    reference_number = Column(String(200), nullable=True)
    account_name = Column(String(200), nullable=True)
    branch = Column(String(100), nullable=True)

    # Additional Notes
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
