from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date

from ..core.database import get_db
from ..models.followup import Followup
from ..schemas.followup import FollowupCreate, FollowupUpdate, FollowupResponse

router = APIRouter()

@router.post("/", response_model=FollowupResponse)
def create_followup(followup: FollowupCreate, db: Session = Depends(get_db)):
    db_followup = Followup(**followup.model_dump())
    db.add(db_followup)
    db.commit()
    db.refresh(db_followup)
    return db_followup

@router.get("/", response_model=List[FollowupResponse])
def get_followups(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Followup)

    if status:
        query = query.filter(Followup.status == status)

    if priority:
        query = query.filter(Followup.priority == priority)

    if search:
        query = query.filter(
            (Followup.title.contains(search)) |
            (Followup.description.contains(search))
        )

    followups = query.offset(skip).limit(limit).all()
    return followups

@router.get("/stats")
def get_followup_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Followup.id)).scalar()
    pending = db.query(func.count(Followup.id)).filter(
        Followup.status == "Pending"
    ).scalar()
    overdue = db.query(func.count(Followup.id)).filter(
        Followup.status == "Overdue"
    ).scalar()
    completed = db.query(func.count(Followup.id)).filter(
        Followup.status == "Completed"
    ).scalar()

    return {
        "total": total or 0,
        "pending": pending or 0,
        "overdue": overdue or 0,
        "completed": completed or 0
    }

@router.get("/{followup_id}", response_model=FollowupResponse)
def get_followup(followup_id: int, db: Session = Depends(get_db)):
    followup = db.query(Followup).filter(Followup.id == followup_id).first()
    if not followup:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    return followup

@router.put("/{followup_id}", response_model=FollowupResponse)
def update_followup(followup_id: int, followup: FollowupUpdate, db: Session = Depends(get_db)):
    db_followup = db.query(Followup).filter(Followup.id == followup_id).first()
    if not db_followup:
        raise HTTPException(status_code=404, detail="Follow-up not found")

    update_data = followup.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_followup, field, value)

    db.commit()
    db.refresh(db_followup)
    return db_followup

@router.delete("/{followup_id}")
def delete_followup(followup_id: int, db: Session = Depends(get_db)):
    db_followup = db.query(Followup).filter(Followup.id == followup_id).first()
    if not db_followup:
        raise HTTPException(status_code=404, detail="Follow-up not found")

    db.delete(db_followup)
    db.commit()
    return {"message": "Follow-up deleted successfully"}
