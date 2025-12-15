from sqlalchemy import Column, Integer, String, Numeric, DateTime, Date, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class FuelLog(Base):
    __tablename__ = "fuel_logs"

    id = Column(Integer, primary_key=True, index=True)

    # References
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)

    # Fuel Details
    date = Column(Date, nullable=False)
    fuel_type = Column(String(50), nullable=False)  # Gasoline, Diesel, Electric
    quantity = Column(Numeric(10, 2), nullable=False)  # Gallons or kWh
    cost = Column(Numeric(10, 2), nullable=False)  # Total cost

    # Location
    station = Column(String(200), nullable=True)  # Gas station name/location

    # Mileage
    odometer_reading = Column(Integer, nullable=True)  # Mileage at time of refuel
    mpg = Column(Numeric(10, 2), nullable=True)  # Miles per gallon (calculated or manual)

    # Additional Information
    notes = Column(String(500), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    vehicle = relationship("Vehicle", backref="fuel_logs")
