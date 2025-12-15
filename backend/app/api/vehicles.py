from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.core.database import get_db
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse

router = APIRouter()


@router.post("/", response_model=VehicleResponse)
@router.post("", response_model=VehicleResponse)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    """Create a new vehicle"""
    # Check if VIN already exists
    existing = db.query(Vehicle).filter(Vehicle.vin == vehicle.vin).first()
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle with this VIN already exists")

    db_vehicle = Vehicle(**vehicle.model_dump())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


@router.get("/", response_model=List[VehicleResponse])
@router.get("", response_model=List[VehicleResponse])
def get_vehicles(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    vehicle_type: Optional[str] = Query(None),
    branch: Optional[str] = Query(None),
    ownership: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all vehicles with optional filters"""
    query = db.query(Vehicle)

    # Apply filters
    if search:
        query = query.filter(
            (Vehicle.make.ilike(f"%{search}%")) |
            (Vehicle.model.ilike(f"%{search}%")) |
            (Vehicle.vin.ilike(f"%{search}%")) |
            (Vehicle.license_plate.ilike(f"%{search}%"))
        )

    if status and status != "All Statuses":
        query = query.filter(Vehicle.status == status)

    if vehicle_type and vehicle_type != "All Types":
        query = query.filter(Vehicle.vehicle_type == vehicle_type)

    if branch and branch != "All Branches":
        query = query.filter(Vehicle.branch == branch)

    if ownership and ownership != "All Types":
        query = query.filter(Vehicle.ownership_type == ownership)

    vehicles = query.order_by(Vehicle.make, Vehicle.model).offset(skip).limit(limit).all()
    return vehicles


@router.get("/stats", response_model=dict)
def get_vehicle_stats(db: Session = Depends(get_db)):
    """Get vehicle statistics"""
    total = db.query(Vehicle).filter(Vehicle.is_active == True).count()
    available = db.query(Vehicle).filter(
        Vehicle.status == "Available",
        Vehicle.is_active == True
    ).count()
    in_use = db.query(Vehicle).filter(
        Vehicle.status == "In Use",
        Vehicle.is_active == True
    ).count()
    maintenance = db.query(Vehicle).filter(
        Vehicle.status == "Maintenance",
        Vehicle.is_active == True
    ).count()

    return {
        "total": total,
        "available": available,
        "in_use": in_use,
        "maintenance": maintenance,
    }


@router.get("/vehicle-types", response_model=List[str])
def get_vehicle_types(db: Session = Depends(get_db)):
    """Get all unique vehicle types"""
    types = db.query(Vehicle.vehicle_type).distinct().filter(Vehicle.vehicle_type.isnot(None)).all()
    return [t[0] for t in types if t[0]]


@router.get("/branches", response_model=List[str])
def get_branches(db: Session = Depends(get_db)):
    """Get all unique branches"""
    branches = db.query(Vehicle.branch).distinct().filter(Vehicle.branch.isnot(None)).all()
    return [b[0] for b in branches if b[0]]


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    """Get a specific vehicle by ID"""
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(vehicle_id: int, vehicle_update: VehicleUpdate, db: Session = Depends(get_db)):
    """Update a vehicle"""
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Check if VIN is being updated and already exists
    update_data = vehicle_update.model_dump(exclude_unset=True)
    if "vin" in update_data and update_data["vin"] != db_vehicle.vin:
        existing = db.query(Vehicle).filter(Vehicle.vin == update_data["vin"]).first()
        if existing:
            raise HTTPException(status_code=400, detail="Vehicle with this VIN already exists")

    for field, value in update_data.items():
        setattr(db_vehicle, field, value)

    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    """Delete a vehicle"""
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db.delete(db_vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}
