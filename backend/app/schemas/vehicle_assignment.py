from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class VehicleAssignmentBase(BaseModel):
    # Basic Information
    vehicle_id: int
    assignment_type: str
    case_reference: Optional[str] = None
    service_reference: Optional[str] = None

    # Schedule
    scheduled_start: datetime
    scheduled_end: datetime
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None

    # Location & Distance
    pickup_location: str
    dropoff_location: str
    estimated_distance: Optional[Decimal] = Decimal("0.00")
    actual_distance: Optional[Decimal] = Decimal("0.00")

    # Driver & Mileage
    driver: Optional[str] = None
    backup_driver: Optional[str] = None
    start_mileage: Optional[int] = 0
    end_mileage: Optional[int] = 0

    # Status & Priority
    status: Optional[str] = "Scheduled"
    priority: Optional[str] = "Normal"

    # Additional Information
    notes: Optional[str] = None


class VehicleAssignmentCreate(VehicleAssignmentBase):
    pass


class VehicleAssignmentUpdate(BaseModel):
    vehicle_id: Optional[int] = None
    assignment_type: Optional[str] = None
    case_reference: Optional[str] = None
    service_reference: Optional[str] = None
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    pickup_location: Optional[str] = None
    dropoff_location: Optional[str] = None
    estimated_distance: Optional[Decimal] = None
    actual_distance: Optional[Decimal] = None
    driver: Optional[str] = None
    backup_driver: Optional[str] = None
    start_mileage: Optional[int] = None
    end_mileage: Optional[int] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    notes: Optional[str] = None


class VehicleAssignmentResponse(VehicleAssignmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
