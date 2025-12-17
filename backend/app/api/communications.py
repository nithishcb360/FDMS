from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from ..models.communication import Communication
from ..schemas.communication import CommunicationCreate, CommunicationUpdate, CommunicationResponse
from ..core.database import get_db

router = APIRouter()

@router.post("/", response_model=CommunicationResponse)
def create_communication(communication: CommunicationCreate, db: Session = Depends(get_db)):
    db_communication = Communication(**communication.model_dump())
    db.add(db_communication)
    db.commit()
    db.refresh(db_communication)
    return db_communication

@router.get("/", response_model=List[CommunicationResponse])
def get_communications(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Communication)

    if search:
        query = query.filter(
            (Communication.family_name.contains(search)) |
            (Communication.subject.contains(search)) |
            (Communication.message.contains(search))
        )

    if type:
        query = query.filter(Communication.type == type)

    if status:
        query = query.filter(Communication.status == status)

    communications = query.order_by(Communication.communication_date.desc()).offset(skip).limit(limit).all()
    return communications

@router.get("/stats")
def get_communication_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Communication.id)).scalar()

    sent = db.query(func.count(Communication.id)).filter(
        Communication.status == "Sent"
    ).scalar()

    delivered = db.query(func.count(Communication.id)).filter(
        Communication.status == "Delivered"
    ).scalar()

    failed = db.query(func.count(Communication.id)).filter(
        Communication.status == "Failed"
    ).scalar()

    return {
        "total": total,
        "sent": sent,
        "delivered": delivered,
        "failed": failed
    }

@router.get("/{communication_id}", response_model=CommunicationResponse)
def get_communication(communication_id: int, db: Session = Depends(get_db)):
    communication = db.query(Communication).filter(Communication.id == communication_id).first()
    if not communication:
        raise HTTPException(status_code=404, detail="Communication not found")
    return communication

@router.put("/{communication_id}", response_model=CommunicationResponse)
def update_communication(
    communication_id: int,
    communication: CommunicationUpdate,
    db: Session = Depends(get_db)
):
    db_communication = db.query(Communication).filter(Communication.id == communication_id).first()
    if not db_communication:
        raise HTTPException(status_code=404, detail="Communication not found")

    update_data = communication.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_communication, key, value)

    db.commit()
    db.refresh(db_communication)
    return db_communication

@router.delete("/{communication_id}")
def delete_communication(communication_id: int, db: Session = Depends(get_db)):
    db_communication = db.query(Communication).filter(Communication.id == communication_id).first()
    if not db_communication:
        raise HTTPException(status_code=404, detail="Communication not found")

    db.delete(db_communication)
    db.commit()
    return {"message": "Communication deleted successfully"}
