from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional

from app.core.database import get_db
from app.models.staff import Staff
from app.schemas.staff import StaffCreate, StaffUpdate, StaffResponse

router = APIRouter()


@router.post("/", response_model=StaffResponse)
@router.post("", response_model=StaffResponse)
def create_staff(staff: StaffCreate, db: Session = Depends(get_db)):
    """Create a new staff member"""
    # Check if email already exists
    existing_email = db.query(Staff).filter(Staff.email == staff.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    db_staff = Staff(**staff.model_dump())
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff


@router.get("/", response_model=List[StaffResponse])
@router.get("", response_model=List[StaffResponse])
def get_staff(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    department: Optional[str] = None,
    employment_type: Optional[str] = None,
    status: Optional[str] = None,
    branch: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all staff members with optional filters"""
    query = db.query(Staff)

    # Apply filters
    if search:
        query = query.filter(
            or_(
                Staff.first_name.ilike(f"%{search}%"),
                Staff.last_name.ilike(f"%{search}%"),
                Staff.email.ilike(f"%{search}%"),
                Staff.position.ilike(f"%{search}%")
            )
        )

    if department:
        query = query.filter(Staff.department == department)

    if employment_type:
        query = query.filter(Staff.employment_type == employment_type)

    if status:
        query = query.filter(Staff.status == status)

    if branch:
        query = query.filter(Staff.branch == branch)

    staff_members = query.order_by(Staff.created_at.desc()).offset(skip).limit(limit).all()
    return staff_members


@router.get("/stats")
def get_staff_stats(db: Session = Depends(get_db)):
    """Get staff statistics"""
    total_staff = db.query(Staff).count()
    active_staff = db.query(Staff).filter(Staff.status == "Active").count()
    full_time = db.query(Staff).filter(and_(Staff.employment_type == "Full-Time", Staff.status == "Active")).count()
    part_time = db.query(Staff).filter(and_(Staff.employment_type == "Part-Time", Staff.status == "Active")).count()

    return {
        "total_staff": total_staff,
        "active_staff": active_staff,
        "full_time": full_time,
        "part_time": part_time
    }


@router.get("/{staff_id}", response_model=StaffResponse)
def get_staff_by_id(staff_id: int, db: Session = Depends(get_db)):
    """Get a specific staff member by ID"""
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return staff


@router.put("/{staff_id}", response_model=StaffResponse)
def update_staff(staff_id: int, staff_update: StaffUpdate, db: Session = Depends(get_db)):
    """Update a staff member"""
    db_staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not db_staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    update_data = staff_update.model_dump(exclude_unset=True)

    # Check if email is being updated and already exists
    if "email" in update_data and update_data["email"] != db_staff.email:
        existing_email = db.query(Staff).filter(Staff.email == update_data["email"]).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already exists")

    for field, value in update_data.items():
        setattr(db_staff, field, value)

    db.commit()
    db.refresh(db_staff)
    return db_staff


@router.delete("/{staff_id}")
def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    """Delete a staff member"""
    db_staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not db_staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    db.delete(db_staff)
    db.commit()
    return {"message": "Staff member deleted successfully", "id": staff_id}
