from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.venue_type import VenueType
from ..schemas.venue_type import VenueTypeCreate, VenueTypeUpdate, VenueTypeResponse

router = APIRouter()


@router.get("/", response_model=List[VenueTypeResponse])
def get_venue_types(db: Session = Depends(get_db)):
    """Get all venue types"""
    venues = db.query(VenueType).all()
    return venues


@router.get("/{venue_id}", response_model=VenueTypeResponse)
def get_venue_type(venue_id: int, db: Session = Depends(get_db)):
    """Get a venue type by ID"""
    venue = db.query(VenueType).filter(VenueType.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue type not found")
    return venue


@router.post("/", response_model=VenueTypeResponse)
def create_venue_type(venue: VenueTypeCreate, db: Session = Depends(get_db)):
    """Create a new venue type"""
    db_venue = VenueType(**venue.model_dump())
    db.add(db_venue)
    db.commit()
    db.refresh(db_venue)
    return db_venue


@router.put("/{venue_id}", response_model=VenueTypeResponse)
def update_venue_type(venue_id: int, venue: VenueTypeUpdate, db: Session = Depends(get_db)):
    """Update a venue type"""
    db_venue = db.query(VenueType).filter(VenueType.id == venue_id).first()
    if not db_venue:
        raise HTTPException(status_code=404, detail="Venue type not found")

    # Update fields
    update_data = venue.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_venue, field, value)

    db.commit()
    db.refresh(db_venue)
    return db_venue


@router.delete("/{venue_id}")
def delete_venue_type(venue_id: int, db: Session = Depends(get_db)):
    """Delete a venue type"""
    db_venue = db.query(VenueType).filter(VenueType.id == venue_id).first()
    if not db_venue:
        raise HTTPException(status_code=404, detail="Venue type not found")

    db.delete(db_venue)
    db.commit()
    return {"message": "Venue type deleted successfully"}
