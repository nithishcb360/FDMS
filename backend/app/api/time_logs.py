from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.time_log import TimeLog
from app.models.user import User
from app.schemas.time_log import TimeLogCreate, TimeLogUpdate, TimeLogResponse

router = APIRouter()


@router.post("/", response_model=TimeLogResponse)
def create_time_log(time_log: TimeLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new time log"""
    db_time_log = TimeLog(**time_log.model_dump(), user_id=current_user.id)
    db.add(db_time_log)
    db.commit()
    db.refresh(db_time_log)
    return db_time_log


@router.get("/", response_model=List[TimeLogResponse])
def get_time_logs(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None,
    log_type: Optional[str] = None,
    staff_member: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all time logs with optional filters"""
    query = db.query(TimeLog)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(TimeLog.user_id == current_user.id)

    if search:
        query = query.filter(
            (TimeLog.staff_member_name.ilike(f"%{search}%"))
        )

    if status:
        query = query.filter(TimeLog.status == status)

    if log_type:
        query = query.filter(TimeLog.log_type == log_type)

    if staff_member:
        query = query.filter(TimeLog.staff_member_name.ilike(f"%{staff_member}%"))

    time_logs = query.order_by(TimeLog.log_date.desc()).offset(skip).limit(limit).all()
    return time_logs


@router.get("/stats")
def get_time_log_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get time log statistics"""
    query = db.query(TimeLog)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(TimeLog.user_id == current_user.id)

    total_logs = query.count()
    total_hours = query.with_entities(func.sum(TimeLog.hours_worked)).scalar() or 0.0
    total_pay = query.with_entities(func.sum(TimeLog.total_pay)).scalar() or 0.0
    overtime_hours = query.filter(TimeLog.is_overtime == True).with_entities(func.sum(TimeLog.hours_worked)).scalar() or 0.0

    return {
        "total_logs": total_logs,
        "total_hours": round(total_hours, 2),
        "total_pay": round(total_pay, 2),
        "overtime_hours": round(overtime_hours, 2)
    }


@router.get("/{time_log_id}", response_model=TimeLogResponse)
def get_time_log(time_log_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a specific time log by ID"""
    query = db.query(TimeLog).filter(TimeLog.id == time_log_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(TimeLog.user_id == current_user.id)

    time_log = query.first()
    if not time_log:
        raise HTTPException(status_code=404, detail="Time log not found")
    return time_log


@router.put("/{time_log_id}", response_model=TimeLogResponse)
def update_time_log(time_log_id: int, time_log: TimeLogUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a time log"""
    query = db.query(TimeLog).filter(TimeLog.id == time_log_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(TimeLog.user_id == current_user.id)

    db_time_log = query.first()
    if not db_time_log:
        raise HTTPException(status_code=404, detail="Time log not found")

    update_data = time_log.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_time_log, field, value)

    db.commit()
    db.refresh(db_time_log)
    return db_time_log


@router.delete("/{time_log_id}")
def delete_time_log(time_log_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a time log"""
    query = db.query(TimeLog).filter(TimeLog.id == time_log_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(TimeLog.user_id == current_user.id)

    time_log = query.first()
    if not time_log:
        raise HTTPException(status_code=404, detail="Time log not found")

    db.delete(time_log)
    db.commit()
    return {"message": "Time log deleted successfully"}
