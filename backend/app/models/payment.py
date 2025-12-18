from sqlalchemy import Column, Integer, String, Float, Date, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    payment_number = Column(String(100), unique=True, nullable=False)

    # Invoice & Payer Information
    invoice_id = Column(Integer, nullable=True)
    invoice_number = Column(String(100), nullable=True)
    payer_name = Column(String(200), nullable=False)

    # Payment Details
    payment_method = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    payment_date = Column(Date, nullable=False)
    reference_number = Column(String(200), nullable=True)
    status = Column(String(50), nullable=False, default="Pending")

    # Additional Information
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
