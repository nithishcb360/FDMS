from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.models.time_log import TimeLog
from app.schemas.time_log import TimeLogCreate, TimeLogUpdate, TimeLogResponse

router = APIRouter()


@router.post("/", response_model=TimeLogResponse)
def create_time_log(time_log: TimeLogCreate, db: Session = Depends(get_db)):
    """Create a new time log"""
    db_time_log = TimeLog(**time_log.model_dump())
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
    db: Session = Depends(get_db)
):
    """Get all time logs with optional filters"""
    query = db.query(TimeLog)

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
def get_time_log_stats(db: Session = Depends(get_db)):
    """Get time log statistics"""
    total_logs = db.query(TimeLog).count()
    total_hours = db.query(func.sum(TimeLog.hours_worked)).scalar() or 0.0
    total_pay = db.query(func.sum(TimeLog.total_pay)).scalar() or 0.0
    overtime_hours = db.query(func.sum(TimeLog.hours_worked)).filter(TimeLog.is_overtime == True).scalar() or 0.0

    return {
        "total_logs": total_logs,
        "total_hours": round(total_hours, 2),
        "total_pay": round(total_pay, 2),
        "overtime_hours": round(overtime_hours, 2)
    }


@router.get("/{time_log_id}", response_model=TimeLogResponse)
def get_time_log(time_log_id: int, db: Session = Depends(get_db)):
    """Get a specific time log by ID"""
    time_log = db.query(TimeLog).filter(TimeLog.id == time_log_id).first()
    if not time_log:
        raise HTTPException(status_code=404, detail="Time log not found")
    return time_log


@router.put("/{time_log_id}", response_model=TimeLogResponse)
def update_time_log(time_log_id: int, time_log: TimeLogUpdate, db: Session = Depends(get_db)):
    """Update a time log"""
    db_time_log = db.query(TimeLog).filter(TimeLog.id == time_log_id).first()
    if not db_time_log:
        raise HTTPException(status_code=404, detail="Time log not found")

    update_data = time_log.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_time_log, field, value)

    db.commit()
    db.refresh(db_time_log)
    return db_time_log


@router.delete("/{time_log_id}")
def delete_time_log(time_log_id: int, db: Session = Depends(get_db)):
    """Delete a time log"""
    time_log = db.query(TimeLog).filter(TimeLog.id == time_log_id).first()
    if not time_log:
        raise HTTPException(status_code=404, detail="Time log not found")

    db.delete(time_log)
    db.commit()
    return {"message": "Time log deleted successfully"}
