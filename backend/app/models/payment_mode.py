from sqlalchemy import Column, Integer, String, Boolean, Numeric, DateTime
from sqlalchemy.sql import func
from ..core.database import Base


class PaymentMode(Base):
    __tablename__ = "payment_modes"

    id = Column(Integer, primary_key=True, index=True)
    payment_method = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    payment_type = Column(String, nullable=False)  # bank_transfer, cash, credit_debit_card, online_payment, installment_plan, cheque
    description = Column(String)

    # Processing fees
    has_processing_fee = Column(Boolean, default=False)
    percentage_fee = Column(Numeric(5, 2), default=0)  # e.g., 2.90 for 2.90%
    fixed_fee = Column(Numeric(10, 2), default=0)  # e.g., 0.30 for $0.30

    # Settings
    is_online = Column(Boolean, default=False)
    requires_authorization = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
