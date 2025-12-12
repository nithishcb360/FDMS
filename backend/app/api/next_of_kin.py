from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.next_of_kin import NextOfKin
from app.schemas.next_of_kin import NextOfKinCreate, NextOfKinUpdate, NextOfKinResponse

router = APIRouter()


@router.post("/", response_model=NextOfKinResponse)
@router.post("", response_model=NextOfKinResponse)
def create_next_of_kin(next_of_kin: NextOfKinCreate, db: Session = Depends(get_db)):
    """Create a new next of kin contact"""
    db_next_of_kin = NextOfKin(**next_of_kin.model_dump())
    db.add(db_next_of_kin)
    db.commit()
    db.refresh(db_next_of_kin)
    return db_next_of_kin


@router.get("/", response_model=List[NextOfKinResponse])
@router.get("", response_model=List[NextOfKinResponse])
def get_next_of_kin(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all next of kin contacts"""
    contacts = db.query(NextOfKin).order_by(NextOfKin.created_at.desc()).offset(skip).limit(limit).all()
    return contacts


@router.get("/{next_of_kin_id}", response_model=NextOfKinResponse)
def get_next_of_kin_by_id(next_of_kin_id: int, db: Session = Depends(get_db)):
    """Get a specific next of kin contact by ID"""
    contact = db.query(NextOfKin).filter(NextOfKin.id == next_of_kin_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Next of kin contact not found")
    return contact


@router.get("/by-case/{case_number}", response_model=List[NextOfKinResponse])
def get_next_of_kin_by_case(case_number: str, db: Session = Depends(get_db)):
    """Get all next of kin contacts for a specific case"""
    contacts = db.query(NextOfKin).filter(NextOfKin.case_number == case_number).all()
    return contacts


@router.put("/{next_of_kin_id}", response_model=NextOfKinResponse)
def update_next_of_kin(next_of_kin_id: int, next_of_kin_update: NextOfKinUpdate, db: Session = Depends(get_db)):
    """Update a next of kin contact"""
    db_next_of_kin = db.query(NextOfKin).filter(NextOfKin.id == next_of_kin_id).first()
    if not db_next_of_kin:
        raise HTTPException(status_code=404, detail="Next of kin contact not found")

    update_data = next_of_kin_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_next_of_kin, field, value)

    db.commit()
    db.refresh(db_next_of_kin)
    return db_next_of_kin


@router.delete("/{next_of_kin_id}")
def delete_next_of_kin(next_of_kin_id: int, db: Session = Depends(get_db)):
    """Delete a next of kin contact"""
    db_next_of_kin = db.query(NextOfKin).filter(NextOfKin.id == next_of_kin_id).first()
    if not db_next_of_kin:
        raise HTTPException(status_code=404, detail="Next of kin contact not found")

    contact_name = f"{db_next_of_kin.first_name} {db_next_of_kin.last_name}"
    db.delete(db_next_of_kin)
    db.commit()
    return {"message": "Next of kin contact deleted successfully", "name": contact_name}
