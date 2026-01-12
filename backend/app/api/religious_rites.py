from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.religious_rite import ReligiousRite
from ..schemas.religious_rite import ReligiousRiteCreate, ReligiousRiteUpdate, ReligiousRiteResponse

router = APIRouter()


@router.get("/", response_model=List[ReligiousRiteResponse])
def get_religious_rites(db: Session = Depends(get_db)):
    """Get all religious rites"""
    rites = db.query(ReligiousRite).all()
    return rites


@router.get("/{rite_id}", response_model=ReligiousRiteResponse)
def get_religious_rite(rite_id: int, db: Session = Depends(get_db)):
    """Get a religious rite by ID"""
    rite = db.query(ReligiousRite).filter(ReligiousRite.id == rite_id).first()
    if not rite:
        raise HTTPException(status_code=404, detail="Religious rite not found")
    return rite


@router.post("/", response_model=ReligiousRiteResponse)
def create_religious_rite(rite: ReligiousRiteCreate, db: Session = Depends(get_db)):
    """Create a new religious rite"""
    db_rite = ReligiousRite(**rite.model_dump())
    db.add(db_rite)
    db.commit()
    db.refresh(db_rite)
    return db_rite


@router.put("/{rite_id}", response_model=ReligiousRiteResponse)
def update_religious_rite(rite_id: int, rite: ReligiousRiteUpdate, db: Session = Depends(get_db)):
    """Update a religious rite"""
    db_rite = db.query(ReligiousRite).filter(ReligiousRite.id == rite_id).first()
    if not db_rite:
        raise HTTPException(status_code=404, detail="Religious rite not found")

    # Update fields
    update_data = rite.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_rite, field, value)

    db.commit()
    db.refresh(db_rite)
    return db_rite


@router.delete("/{rite_id}")
def delete_religious_rite(rite_id: int, db: Session = Depends(get_db)):
    """Delete a religious rite"""
    db_rite = db.query(ReligiousRite).filter(ReligiousRite.id == rite_id).first()
    if not db_rite:
        raise HTTPException(status_code=404, detail="Religious rite not found")

    db.delete(db_rite)
    db.commit()
    return {"message": "Religious rite deleted successfully"}
