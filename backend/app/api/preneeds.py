from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from ..core.database import get_db
from ..models.preneed import Preneed
from ..schemas.preneed import PreneedCreate, PreneedUpdate, PreneedResponse

router = APIRouter()

@router.post("/", response_model=PreneedResponse)
def create_preneed(preneed: PreneedCreate, db: Session = Depends(get_db)):
    db_preneed = Preneed(**preneed.model_dump())
    db.add(db_preneed)
    db.commit()
    db.refresh(db_preneed)
    return db_preneed

@router.get("/", response_model=List[PreneedResponse])
def get_preneeds(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    payment_plan: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Preneed)

    if status:
        query = query.filter(Preneed.status == status)

    if payment_plan:
        query = query.filter(Preneed.payment_plan == payment_plan)

    if search:
        query = query.filter(
            (Preneed.plan_holder_name.contains(search)) |
            (Preneed.service_type.contains(search))
        )

    preneeds = query.offset(skip).limit(limit).all()
    return preneeds

@router.get("/stats")
def get_preneed_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Preneed.id)).scalar()
    active = db.query(func.count(Preneed.id)).filter(
        Preneed.status == "Active"
    ).scalar()
    total_value = db.query(func.sum(Preneed.estimated_cost)).scalar()
    total_paid = db.query(func.sum(Preneed.amount_paid)).scalar()

    return {
        "total_plans": total or 0,
        "active_plans": active or 0,
        "total_value": total_value or 0.0,
        "total_paid": total_paid or 0.0
    }

@router.get("/{preneed_id}", response_model=PreneedResponse)
def get_preneed(preneed_id: int, db: Session = Depends(get_db)):
    preneed = db.query(Preneed).filter(Preneed.id == preneed_id).first()
    if not preneed:
        raise HTTPException(status_code=404, detail="Pre-need plan not found")
    return preneed

@router.put("/{preneed_id}", response_model=PreneedResponse)
def update_preneed(preneed_id: int, preneed: PreneedUpdate, db: Session = Depends(get_db)):
    db_preneed = db.query(Preneed).filter(Preneed.id == preneed_id).first()
    if not db_preneed:
        raise HTTPException(status_code=404, detail="Pre-need plan not found")

    update_data = preneed.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_preneed, field, value)

    db.commit()
    db.refresh(db_preneed)
    return db_preneed

@router.delete("/{preneed_id}")
def delete_preneed(preneed_id: int, db: Session = Depends(get_db)):
    db_preneed = db.query(Preneed).filter(Preneed.id == preneed_id).first()
    if not db_preneed:
        raise HTTPException(status_code=404, detail="Pre-need plan not found")

    db.delete(db_preneed)
    db.commit()
    return {"message": "Pre-need plan deleted successfully"}
