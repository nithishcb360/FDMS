from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from decimal import Decimal

from app.core.database import get_db
from app.models.fuel_log import FuelLog
from app.models.vehicle import Vehicle
from app.schemas.fuel_log import FuelLogCreate, FuelLogUpdate, FuelLogResponse

router = APIRouter()


@router.post("/", response_model=FuelLogResponse)
@router.post("", response_model=FuelLogResponse)
def create_fuel_log(fuel_log: FuelLogCreate, db: Session = Depends(get_db)):
    """Create a new fuel log"""
    # Verify vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == fuel_log.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db_fuel_log = FuelLog(**fuel_log.model_dump())
    db.add(db_fuel_log)
    db.commit()
    db.refresh(db_fuel_log)
    return db_fuel_log


@router.get("/", response_model=List[FuelLogResponse])
@router.get("", response_model=List[FuelLogResponse])
def get_fuel_logs(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    fuel_type: Optional[str] = Query(None),
    vehicle_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all fuel logs with optional filters"""
    query = db.query(FuelLog)

    # Apply filters
    if search:
        # Join with Vehicle to search vehicle details
        query = query.join(Vehicle).filter(
            (Vehicle.make.ilike(f"%{search}%")) |
            (Vehicle.model.ilike(f"%{search}%")) |
            (Vehicle.license_plate.ilike(f"%{search}%")) |
            (FuelLog.station.ilike(f"%{search}%")) |
            (func.cast(FuelLog.id, String).ilike(f"%{search}%"))
        )

    if fuel_type and fuel_type != "All Types":
        query = query.filter(FuelLog.fuel_type == fuel_type)

    if vehicle_id:
        query = query.filter(FuelLog.vehicle_id == vehicle_id)

    fuel_logs = query.order_by(desc(FuelLog.date), desc(FuelLog.id)).offset(skip).limit(limit).all()
    return fuel_logs


@router.get("/stats", response_model=dict)
def get_fuel_log_stats(db: Session = Depends(get_db)):
    """Get fuel log statistics"""
    total_logs = db.query(FuelLog).count()

    total_fuel = db.query(func.sum(FuelLog.quantity)).scalar() or Decimal(0)
    total_cost = db.query(func.sum(FuelLog.cost)).scalar() or Decimal(0)

    # Calculate average MPG (only from logs with MPG data)
    avg_mpg = db.query(func.avg(FuelLog.mpg)).filter(FuelLog.mpg.isnot(None)).scalar() or Decimal(0)

    return {
        "total_logs": total_logs,
        "total_fuel": float(total_fuel),
        "total_cost": float(total_cost),
        "avg_mpg": float(avg_mpg),
    }


@router.get("/fuel-types", response_model=List[str])
def get_fuel_types(db: Session = Depends(get_db)):
    """Get all unique fuel types from logs"""
    types = db.query(FuelLog.fuel_type).distinct().filter(FuelLog.fuel_type.isnot(None)).all()
    return [t[0] for t in types if t[0]]


@router.get("/{fuel_log_id}", response_model=FuelLogResponse)
def get_fuel_log(fuel_log_id: int, db: Session = Depends(get_db)):
    """Get a specific fuel log by ID"""
    fuel_log = db.query(FuelLog).filter(FuelLog.id == fuel_log_id).first()
    if not fuel_log:
        raise HTTPException(status_code=404, detail="Fuel log not found")
    return fuel_log


@router.put("/{fuel_log_id}", response_model=FuelLogResponse)
def update_fuel_log(fuel_log_id: int, fuel_log_update: FuelLogUpdate, db: Session = Depends(get_db)):
    """Update a fuel log"""
    db_fuel_log = db.query(FuelLog).filter(FuelLog.id == fuel_log_id).first()
    if not db_fuel_log:
        raise HTTPException(status_code=404, detail="Fuel log not found")

    # If vehicle_id is being updated, verify it exists
    update_data = fuel_log_update.model_dump(exclude_unset=True)
    if "vehicle_id" in update_data:
        vehicle = db.query(Vehicle).filter(Vehicle.id == update_data["vehicle_id"]).first()
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")

    for field, value in update_data.items():
        setattr(db_fuel_log, field, value)

    db.commit()
    db.refresh(db_fuel_log)
    return db_fuel_log


@router.delete("/{fuel_log_id}")
def delete_fuel_log(fuel_log_id: int, db: Session = Depends(get_db)):
    """Delete a fuel log"""
    db_fuel_log = db.query(FuelLog).filter(FuelLog.id == fuel_log_id).first()
    if not db_fuel_log:
        raise HTTPException(status_code=404, detail="Fuel log not found")

    db.delete(db_fuel_log)
    db.commit()
    return {"message": "Fuel log deleted successfully"}
