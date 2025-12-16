from sqlalchemy import Column, Integer, String, Float, Date, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(100), unique=True, nullable=False)

    # Client Information
    client_name = Column(String(200), nullable=False)
    client_email = Column(String(200), nullable=True)
    client_phone = Column(String(50), nullable=True)
    billing_address = Column(Text, nullable=True)
    branch = Column(String(100), nullable=True)

    # Invoice Details
    case_reference = Column(String(100), nullable=True)
    service_reference = Column(String(100), nullable=True)
    invoice_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False, default="Draft")

    # Financial Details
    subtotal = Column(Float, nullable=False, default=0.0)
    tax_amount = Column(Float, nullable=False, default=0.0)
    discount_amount = Column(Float, nullable=False, default=0.0)
    total_amount = Column(Float, nullable=False, default=0.0)
    paid_amount = Column(Float, nullable=False, default=0.0)
    balance = Column(Float, nullable=False, default=0.0)

    # Terms & Notes
    payment_terms = Column(Text, nullable=True)
    internal_notes = Column(Text, nullable=True)
    client_notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
