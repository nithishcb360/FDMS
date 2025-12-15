from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import datetime, date


class VehicleBase(BaseModel):
    # Identification
    vehicle_type: str
    branch: Optional[str] = None

    # Vehicle Details
    make: str
    model: str
    year: int
    color: Optional[str] = None
    vin: str
    license_plate: str

    # Technical Specifications
    fuel_type: Optional[str] = None
    tank_capacity: Optional[condecimal(max_digits=10, decimal_places=2)] = 0.00
    seating_capacity: Optional[int] = 0
    cargo_capacity: Optional[condecimal(max_digits=10, decimal_places=2)] = 0.00

    # Status & Condition
    status: Optional[str] = "Available"
    condition: Optional[str] = "Good"
    ownership_type: Optional[str] = "Owned"

    # Mileage Tracking
    current_mileage: Optional[int] = 0
    purchase_mileage: Optional[int] = 0

    # Financial Information
    purchase_price: Optional[condecimal(max_digits=10, decimal_places=2)] = 0.00
    purchase_date: Optional[date] = None
    monthly_lease_amount: Optional[condecimal(max_digits=10, decimal_places=2)] = 0.00

    # Insurance & Registration
    insurance_company: Optional[str] = None
    policy_number: Optional[str] = None
    insurance_expiry_date: Optional[date] = None
    registration_expiry_date: Optional[date] = None

    # Maintenance Tracking
    last_service_date: Optional[date] = None
    last_service_mileage: Optional[int] = None
    next_service_due_date: Optional[date] = None
    next_service_due_mileage: Optional[int] = None

    # Additional Information
    notes: Optional[str] = None
    is_active: Optional[bool] = True


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    # Identification
    vehicle_type: Optional[str] = None
    branch: Optional[str] = None

    # Vehicle Details
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    color: Optional[str] = None
    vin: Optional[str] = None
    license_plate: Optional[str] = None

    # Technical Specifications
    fuel_type: Optional[str] = None
    tank_capacity: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    seating_capacity: Optional[int] = None
    cargo_capacity: Optional[condecimal(max_digits=10, decimal_places=2)] = None

    # Status & Condition
    status: Optional[str] = None
    condition: Optional[str] = None
    ownership_type: Optional[str] = None

    # Mileage Tracking
    current_mileage: Optional[int] = None
    purchase_mileage: Optional[int] = None

    # Financial Information
    purchase_price: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    purchase_date: Optional[date] = None
    monthly_lease_amount: Optional[condecimal(max_digits=10, decimal_places=2)] = None

    # Insurance & Registration
    insurance_company: Optional[str] = None
    policy_number: Optional[str] = None
    insurance_expiry_date: Optional[date] = None
    registration_expiry_date: Optional[date] = None

    # Maintenance Tracking
    last_service_date: Optional[date] = None
    last_service_mileage: Optional[int] = None
    next_service_due_date: Optional[date] = None
    next_service_due_mileage: Optional[int] = None

    # Additional Information
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class VehicleResponse(VehicleBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
