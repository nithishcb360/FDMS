from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.assignment import Assignment
from app.models.user import User
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate, AssignmentResponse

router = APIRouter()


@router.post("/", response_model=AssignmentResponse)
@router.post("", response_model=AssignmentResponse)
def create_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new assignment"""
    db_assignment = Assignment(**assignment.model_dump(), user_id=current_user.id)
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@router.get("/", response_model=List[AssignmentResponse])
@router.get("", response_model=List[AssignmentResponse])
def get_assignments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all assignments"""
    query = db.query(Assignment)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Assignment.user_id == current_user.id)

    assignments = query.order_by(Assignment.assigned_date.desc()).offset(skip).limit(limit).all()
    return assignments


@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment_by_id(assignment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a specific assignment by ID"""
    query = db.query(Assignment).filter(Assignment.id == assignment_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Assignment.user_id == current_user.id)

    assignment = query.first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


@router.get("/by-case/{case_number}", response_model=List[AssignmentResponse])
def get_assignments_by_case(case_number: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all assignments for a specific case"""
    query = db.query(Assignment).filter(Assignment.case_number == case_number)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Assignment.user_id == current_user.id)

    assignments = query.order_by(Assignment.assigned_date.desc()).all()
    return assignments


@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(
    assignment_id: int,
    assignment_update: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an assignment"""
    query = db.query(Assignment).filter(Assignment.id == assignment_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Assignment.user_id == current_user.id)

    db_assignment = query.first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    update_data = assignment_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_assignment, field, value)

    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete an assignment"""
    query = db.query(Assignment).filter(Assignment.id == assignment_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Assignment.user_id == current_user.id)

    db_assignment = query.first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(db_assignment)
    db.commit()
    return {"message": "Assignment deleted successfully", "id": assignment_id}
