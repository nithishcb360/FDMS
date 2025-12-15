from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
from app.models.schedule import Schedule
from app.models.case import Case
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate, ScheduleResponse

router = APIRouter()


@router.post("/", response_model=ScheduleResponse)
@router.post("", response_model=ScheduleResponse)
def create_schedule(schedule: ScheduleCreate, db: Session = Depends(get_db)):
    """Create a new schedule"""
    # Verify case exists
    case = db.query(Case).filter(Case.id == schedule.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    db_schedule = Schedule(**schedule.model_dump())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


@router.get("/", response_model=List[dict])
@router.get("", response_model=List[dict])
def get_schedules(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all schedules with case information"""
    schedules = (
        db.query(Schedule)
        .options(joinedload(Schedule.case))
        .order_by(Schedule.start_datetime.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    result = []
    for schedule in schedules:
        result.append({
            "id": schedule.id,
            "case_id": schedule.case_id,
            "case_number": schedule.case.case_number,
            "deceased_name": f"{schedule.case.first_name} {schedule.case.last_name}",
            "event_type": schedule.event_type,
            "title": schedule.title,
            "description": schedule.description,
            "venue": schedule.venue,
            "location_details": schedule.location_details,
            "assigned_staff": schedule.assigned_staff,
            "notes": schedule.notes,
            "setup_notes": schedule.setup_notes,
            "start_datetime": schedule.start_datetime,
            "end_datetime": schedule.end_datetime,
            "confirmation_status": schedule.confirmation_status,
            "created_at": schedule.created_at,
            "updated_at": schedule.updated_at,
        })

    return result


@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(schedule_id: int, db: Session = Depends(get_db)):
    """Get a specific schedule by ID"""
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(schedule_id: int, schedule_update: ScheduleUpdate, db: Session = Depends(get_db)):
    """Update a schedule"""
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    # If updating case_id, verify the case exists
    if schedule_update.case_id is not None:
        case = db.query(Case).filter(Case.id == schedule_update.case_id).first()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")

    update_data = schedule_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_schedule, field, value)

    db.commit()
    db.refresh(db_schedule)
    return db_schedule


@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    """Delete a schedule"""
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    db.delete(db_schedule)
    db.commit()
    return {"message": "Schedule deleted successfully"}
