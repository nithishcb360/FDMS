from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.case import Case
from app.models.user import User
from app.schemas.case import CaseCreate, CaseUpdate, CaseResponse

router = APIRouter()


def generate_case_number():
    """Generate a unique case number in format FD-YYYY-XXXX"""
    year = datetime.now().year
    return f"FD-{year}-{datetime.now().strftime('%m%d%H%M%S')}"


@router.post("/", response_model=CaseResponse)
@router.post("", response_model=CaseResponse)
def create_case(
    case: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new case"""
    db_case = Case(
        case_number=generate_case_number(),
        user_id=current_user.id,
        **case.model_dump()
    )
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case


@router.get("/", response_model=List[CaseResponse])
@router.get("", response_model=List[CaseResponse])
def get_cases(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all cases for the current user (or all cases if superadmin)"""
    query = db.query(Case)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Case.user_id == current_user.id)

    cases = query.order_by(Case.created_at.desc()).offset(skip).limit(limit).all()
    return cases


@router.get("/{case_id}", response_model=CaseResponse)
def get_case(
    case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific case by ID"""
    query = db.query(Case).filter(Case.id == case_id)

    # If not superadmin, ensure case belongs to user
    if not current_user.is_superuser:
        query = query.filter(Case.user_id == current_user.id)

    case = query.first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.put("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: int,
    case_update: CaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a case"""
    query = db.query(Case).filter(Case.id == case_id)

    # If not superadmin, ensure case belongs to user
    if not current_user.is_superuser:
        query = query.filter(Case.user_id == current_user.id)

    db_case = query.first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")

    update_data = case_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_case, field, value)

    db.commit()
    db.refresh(db_case)
    return db_case


@router.delete("/{case_id}")
def delete_case(
    case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a case"""
    query = db.query(Case).filter(Case.id == case_id)

    # If not superadmin, ensure case belongs to user
    if not current_user.is_superuser:
        query = query.filter(Case.user_id == current_user.id)

    db_case = query.first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")

    db.delete(db_case)
    db.commit()
    return {"message": "Case deleted successfully", "case_number": db_case.case_number}
