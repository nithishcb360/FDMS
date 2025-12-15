from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.core.database import get_db
from app.models.arrangement import Arrangement
from app.models.case import Case
from app.schemas.arrangement import ArrangementCreate, ArrangementUpdate, ArrangementResponse

router = APIRouter()


@router.post("/", response_model=ArrangementResponse)
@router.post("", response_model=ArrangementResponse)
def create_arrangement(arrangement: ArrangementCreate, db: Session = Depends(get_db)):
    """Create a new arrangement"""
    # Verify case exists
    case = db.query(Case).filter(Case.id == arrangement.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    db_arrangement = Arrangement(**arrangement.model_dump())
    db.add(db_arrangement)
    db.commit()
    db.refresh(db_arrangement)
    return db_arrangement


@router.get("/", response_model=List[dict])
@router.get("", response_model=List[dict])
def get_arrangements(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    approval_status: Optional[str] = Query(None),
    is_confirmed: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all arrangements with optional filters"""
    query = db.query(Arrangement).options(joinedload(Arrangement.case))

    # Apply filters
    if search:
        query = query.join(Case).filter(
            (Case.first_name.ilike(f"%{search}%")) |
            (Case.last_name.ilike(f"%{search}%")) |
            (Case.case_number.ilike(f"%{search}%"))
        )

    if approval_status and approval_status != "All Statuses":
        query = query.filter(Arrangement.approval_status == approval_status)

    if is_confirmed is not None:
        query = query.filter(Arrangement.is_confirmed == is_confirmed)

    arrangements = query.order_by(Arrangement.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for arrangement in arrangements:
        result.append({
            "id": arrangement.id,
            "case_id": arrangement.case_id,
            "case_number": arrangement.case.case_number,
            "deceased_name": f"{arrangement.case.first_name} {arrangement.case.last_name}",
            "service_package": arrangement.service_package,
            "service_date": arrangement.service_date,
            "service_time": arrangement.service_time,
            "duration_minutes": arrangement.duration_minutes,
            "venue": arrangement.venue,
            "estimated_attendees": arrangement.estimated_attendees,
            "religious_rite": arrangement.religious_rite,
            "clergy_name": arrangement.clergy_name,
            "clergy_contact": arrangement.clergy_contact,
            "special_requests": arrangement.special_requests,
            "music_preferences": arrangement.music_preferences,
            "eulogy_speakers": arrangement.eulogy_speakers,
            "package_customized": arrangement.package_customized,
            "customization_notes": arrangement.customization_notes,
            "approval_status": arrangement.approval_status,
            "is_confirmed": arrangement.is_confirmed,
            "created_at": arrangement.created_at,
            "updated_at": arrangement.updated_at,
        })

    return result


@router.get("/stats", response_model=dict)
def get_arrangement_stats(db: Session = Depends(get_db)):
    """Get arrangement statistics"""
    total = db.query(Arrangement).count()
    pending = db.query(Arrangement).filter(Arrangement.approval_status == "Pending Approval").count()
    approved = db.query(Arrangement).filter(Arrangement.approval_status == "Approved").count()
    confirmed = db.query(Arrangement).filter(Arrangement.is_confirmed == True).count()

    return {
        "total": total,
        "pending_approval": pending,
        "approved": approved,
        "confirmed": confirmed,
    }


@router.get("/{arrangement_id}", response_model=ArrangementResponse)
def get_arrangement(arrangement_id: int, db: Session = Depends(get_db)):
    """Get a specific arrangement by ID"""
    arrangement = db.query(Arrangement).filter(Arrangement.id == arrangement_id).first()
    if not arrangement:
        raise HTTPException(status_code=404, detail="Arrangement not found")
    return arrangement


@router.put("/{arrangement_id}", response_model=ArrangementResponse)
def update_arrangement(arrangement_id: int, arrangement_update: ArrangementUpdate, db: Session = Depends(get_db)):
    """Update an arrangement"""
    db_arrangement = db.query(Arrangement).filter(Arrangement.id == arrangement_id).first()
    if not db_arrangement:
        raise HTTPException(status_code=404, detail="Arrangement not found")

    # If updating case_id, verify the case exists
    if arrangement_update.case_id is not None:
        case = db.query(Case).filter(Case.id == arrangement_update.case_id).first()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")

    update_data = arrangement_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_arrangement, field, value)

    db.commit()
    db.refresh(db_arrangement)
    return db_arrangement


@router.delete("/{arrangement_id}")
def delete_arrangement(arrangement_id: int, db: Session = Depends(get_db)):
    """Delete an arrangement"""
    db_arrangement = db.query(Arrangement).filter(Arrangement.id == arrangement_id).first()
    if not db_arrangement:
        raise HTTPException(status_code=404, detail="Arrangement not found")

    db.delete(db_arrangement)
    db.commit()
    return {"message": "Arrangement deleted successfully"}
