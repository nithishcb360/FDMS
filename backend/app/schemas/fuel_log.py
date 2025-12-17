from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import datetime, date


class FuelLogBase(BaseModel):
    vehicle_id: int
    date: date
    fuel_type: str
    quantity: condecimal(max_digits=10, decimal_places=2)
    cost: condecimal(max_digits=10, decimal_places=2)
    station: Optional[str] = None
    odometer_reading: Optional[int] = None
    mpg: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    notes: Optional[str] = None


class FuelLogCreate(FuelLogBase):
    pass


class FuelLogUpdate(BaseModel):
    vehicle_id: Optional[int] = None
    date: Optional[date] = None
    fuel_type: Optional[str] = None
    quantity: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    cost: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    station: Optional[str] = None
    odometer_reading: Optional[int] = None
    mpg: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    notes: Optional[str] = None


class FuelLogResponse(FuelLogBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
