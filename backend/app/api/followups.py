from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date

from ..core.database import get_db
from ..core.security import get_current_user
from ..models.followup import Followup
from ..models.user import User
from ..schemas.followup import FollowupCreate, FollowupUpdate, FollowupResponse

router = APIRouter()

@router.post("/", response_model=FollowupResponse)
def create_followup(followup: FollowupCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_followup = Followup(**followup.model_dump(), user_id=current_user.id)
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Followup)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Followup.user_id == current_user.id)

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
def get_followup_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Followup)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Followup.user_id == current_user.id)

    total = query.count()
    pending = query.filter(
        Followup.status == "Pending"
    ).count()
    overdue = query.filter(
        Followup.status == "Overdue"
    ).count()
    completed = query.filter(
        Followup.status == "Completed"
    ).count()

    return {
        "total": total or 0,
        "pending": pending or 0,
        "overdue": overdue or 0,
        "completed": completed or 0
    }

@router.get("/{followup_id}", response_model=FollowupResponse)
def get_followup(followup_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Followup).filter(Followup.id == followup_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Followup.user_id == current_user.id)

    followup = query.first()
    if not followup:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    return followup

@router.put("/{followup_id}", response_model=FollowupResponse)
def update_followup(followup_id: int, followup: FollowupUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Followup).filter(Followup.id == followup_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Followup.user_id == current_user.id)

    db_followup = query.first()
    if not db_followup:
        raise HTTPException(status_code=404, detail="Follow-up not found")

    update_data = followup.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_followup, field, value)

    db.commit()
    db.refresh(db_followup)
    return db_followup

@router.delete("/{followup_id}")
def delete_followup(followup_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Followup).filter(Followup.id == followup_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Followup.user_id == current_user.id)

    db_followup = query.first()
    if not db_followup:
        raise HTTPException(status_code=404, detail="Follow-up not found")

    db.delete(db_followup)
    db.commit()
    return {"message": "Follow-up deleted successfully"}
