from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.schedule import Schedule
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate, ScheduleResponse

router = APIRouter()


@router.post("/", response_model=ScheduleResponse)
def create_schedule(schedule: ScheduleCreate, db: Session = Depends(get_db)):
    """Create a new schedule"""
    db_schedule = Schedule(**schedule.model_dump())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


@router.get("/", response_model=List[ScheduleResponse])
def get_schedules(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None,
    shift_type: Optional[str] = None,
    staff_member: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all schedules with optional filters"""
    query = db.query(Schedule)

    if search:
        query = query.filter(
            (Schedule.staff_member_name.ilike(f"%{search}%"))
        )

    if status:
        query = query.filter(Schedule.status == status)

    if shift_type:
        query = query.filter(Schedule.shift_type == shift_type)

    if staff_member:
        query = query.filter(Schedule.staff_member_name.ilike(f"%{staff_member}%"))

    schedules = query.order_by(Schedule.shift_date.desc()).offset(skip).limit(limit).all()
    return schedules


@router.get("/stats")
def get_schedule_stats(db: Session = Depends(get_db)):
    """Get schedule statistics"""
    total_schedules = db.query(Schedule).count()
    scheduled = db.query(Schedule).filter(Schedule.status == "Scheduled").count()
    completed = db.query(Schedule).filter(Schedule.status == "Completed").count()
    overtime_shifts = db.query(Schedule).filter(Schedule.is_overtime == True).count()

    return {
        "total_schedules": total_schedules,
        "scheduled": scheduled,
        "completed": completed,
        "overtime_shifts": overtime_shifts
    }


@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(schedule_id: int, db: Session = Depends(get_db)):
    """Get a specific schedule by ID"""
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(schedule_id: int, schedule: ScheduleUpdate, db: Session = Depends(get_db)):
    """Update a schedule"""
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    update_data = schedule.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_schedule, field, value)

    db.commit()
    db.refresh(db_schedule)
    return db_schedule


@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    """Delete a schedule"""
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted successfully"}
