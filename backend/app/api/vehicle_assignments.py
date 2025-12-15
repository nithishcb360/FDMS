from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional

from app.core.database import get_db
from app.models.vehicle_assignment import VehicleAssignment
from app.models.vehicle import Vehicle
from app.schemas.vehicle_assignment import VehicleAssignmentCreate, VehicleAssignmentUpdate, VehicleAssignmentResponse

router = APIRouter()


@router.post("/", response_model=VehicleAssignmentResponse)
@router.post("", response_model=VehicleAssignmentResponse)
def create_assignment(assignment: VehicleAssignmentCreate, db: Session = Depends(get_db)):
    """Create a new vehicle assignment"""
    # Check if vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == assignment.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db_assignment = VehicleAssignment(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@router.get("/", response_model=List[VehicleAssignmentResponse])
@router.get("", response_model=List[VehicleAssignmentResponse])
def get_assignments(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    assignment_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all vehicle assignments with optional filters"""
    query = db.query(VehicleAssignment)

    # Apply filters
    if search:
        query = query.filter(
            (VehicleAssignment.case_reference.ilike(f"%{search}%")) |
            (VehicleAssignment.service_reference.ilike(f"%{search}%")) |
            (VehicleAssignment.driver.ilike(f"%{search}%")) |
            (VehicleAssignment.pickup_location.ilike(f"%{search}%")) |
            (VehicleAssignment.dropoff_location.ilike(f"%{search}%"))
        )

    if status and status != "All Statuses":
        query = query.filter(VehicleAssignment.status == status)

    if assignment_type and assignment_type != "All Types":
        query = query.filter(VehicleAssignment.assignment_type == assignment_type)

    assignments = query.order_by(VehicleAssignment.scheduled_start.desc()).offset(skip).limit(limit).all()
    return assignments


@router.get("/stats", response_model=dict)
def get_assignment_stats(db: Session = Depends(get_db)):
    """Get vehicle assignment statistics"""
    total = db.query(VehicleAssignment).count()
    scheduled = db.query(VehicleAssignment).filter(
        VehicleAssignment.status == "Scheduled"
    ).count()
    in_progress = db.query(VehicleAssignment).filter(
        VehicleAssignment.status == "In Progress"
    ).count()
    completed = db.query(VehicleAssignment).filter(
        VehicleAssignment.status == "Completed"
    ).count()

    return {
        "total": total,
        "scheduled": scheduled,
        "in_progress": in_progress,
        "completed": completed,
    }


@router.get("/assignment-types", response_model=List[str])
def get_assignment_types(db: Session = Depends(get_db)):
    """Get all unique assignment types"""
    types = db.query(VehicleAssignment.assignment_type).distinct().filter(VehicleAssignment.assignment_type.isnot(None)).all()
    return [t[0] for t in types if t[0]]


@router.get("/{assignment_id}", response_model=VehicleAssignmentResponse)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """Get a specific assignment by ID"""
    assignment = db.query(VehicleAssignment).filter(VehicleAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


@router.put("/{assignment_id}", response_model=VehicleAssignmentResponse)
def update_assignment(assignment_id: int, assignment_update: VehicleAssignmentUpdate, db: Session = Depends(get_db)):
    """Update an assignment"""
    db_assignment = db.query(VehicleAssignment).filter(VehicleAssignment.id == assignment_id).first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    update_data = assignment_update.model_dump(exclude_unset=True)

    # Check if vehicle exists if vehicle_id is being updated
    if "vehicle_id" in update_data:
        vehicle = db.query(Vehicle).filter(Vehicle.id == update_data["vehicle_id"]).first()
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")

    for field, value in update_data.items():
        setattr(db_assignment, field, value)

    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """Delete an assignment"""
    db_assignment = db.query(VehicleAssignment).filter(VehicleAssignment.id == assignment_id).first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(db_assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}
