from sqlalchemy import Column, Integer, String, DateTime, Numeric, Text, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class VehicleAssignment(Base):
    __tablename__ = "vehicle_assignments"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    assignment_type = Column(String(100), nullable=False)  # Service, Transport, Maintenance, Other
    case_reference = Column(String(100), nullable=True)
    service_reference = Column(String(100), nullable=True)

    # Schedule
    scheduled_start = Column(DateTime, nullable=False)
    scheduled_end = Column(DateTime, nullable=False)
    actual_start = Column(DateTime, nullable=True)
    actual_end = Column(DateTime, nullable=True)

    # Location & Distance
    pickup_location = Column(String(500), nullable=False)
    dropoff_location = Column(String(500), nullable=False)
    estimated_distance = Column(Numeric(10, 2), default=0.00)
    actual_distance = Column(Numeric(10, 2), default=0.00)

    # Driver & Mileage
    driver = Column(String(200), nullable=True)
    backup_driver = Column(String(200), nullable=True)
    start_mileage = Column(Integer, default=0)
    end_mileage = Column(Integer, default=0)

    # Status & Priority
    status = Column(String(50), default="Scheduled")  # Scheduled, In Progress, Completed, Cancelled
    priority = Column(String(50), default="Normal")  # Low, Normal, High, Urgent

    # Additional Information
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
