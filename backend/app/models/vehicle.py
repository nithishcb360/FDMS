from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, Date
from sqlalchemy.sql import func
from app.core.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    # Identification
    vehicle_type = Column(String(100), nullable=False)  # Hearse, Limousine, Service Van, etc.
    branch = Column(String(200), nullable=True)

    # Vehicle Details
    make = Column(String(100), nullable=False)  # e.g., Cadillac, Lincoln
    model = Column(String(100), nullable=False)  # e.g., XTS, Continental
    year = Column(Integer, nullable=False)
    color = Column(String(50), nullable=True)
    vin = Column(String(17), nullable=False, unique=True)  # 17-character VIN
    license_plate = Column(String(20), nullable=False)

    # Technical Specifications
    fuel_type = Column(String(50), nullable=True)  # Gasoline, Diesel, Electric, Hybrid
    tank_capacity = Column(Numeric(10, 2), default=0.00)  # Gallons
    seating_capacity = Column(Integer, default=0)
    cargo_capacity = Column(Numeric(10, 2), default=0.00)  # Cubic feet

    # Status & Condition
    status = Column(String(50), default="Available")  # Available, In Use, Maintenance, Retired
    condition = Column(String(50), default="Good")  # Excellent, Good, Fair, Poor
    ownership_type = Column(String(50), default="Owned")  # Owned, Leased, Rented

    # Mileage Tracking
    current_mileage = Column(Integer, default=0)
    purchase_mileage = Column(Integer, default=0)

    # Financial Information
    purchase_price = Column(Numeric(10, 2), default=0.00)
    purchase_date = Column(Date, nullable=True)
    monthly_lease_amount = Column(Numeric(10, 2), default=0.00)

    # Insurance & Registration
    insurance_company = Column(String(200), nullable=True)
    policy_number = Column(String(100), nullable=True)
    insurance_expiry_date = Column(Date, nullable=True)
    registration_expiry_date = Column(Date, nullable=True)

    # Maintenance Tracking
    last_service_date = Column(Date, nullable=True)
    last_service_mileage = Column(Integer, nullable=True)
    next_service_due_date = Column(Date, nullable=True)
    next_service_due_mileage = Column(Integer, nullable=True)

    # Additional Information
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
