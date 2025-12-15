from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from decimal import Decimal

from app.core.database import get_db
from app.models.venue_booking import VenueBooking
from app.models.case import Case
from app.schemas.venue_booking import VenueBookingCreate, VenueBookingUpdate, VenueBookingResponse

router = APIRouter()


@router.post("/", response_model=VenueBookingResponse)
@router.post("", response_model=VenueBookingResponse)
def create_venue_booking(booking: VenueBookingCreate, db: Session = Depends(get_db)):
    """Create a new venue booking"""
    # Verify case exists
    case = db.query(Case).filter(Case.id == booking.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    db_booking = VenueBooking(**booking.model_dump())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.get("/", response_model=List[dict])
@router.get("", response_model=List[dict])
def get_venue_bookings(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    venue: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all venue bookings with optional filters"""
    query = db.query(VenueBooking).options(joinedload(VenueBooking.case))

    # Apply filters
    if search:
        query = query.join(Case).filter(
            (Case.first_name.ilike(f"%{search}%")) |
            (Case.last_name.ilike(f"%{search}%")) |
            (Case.case_number.ilike(f"%{search}%")) |
            (VenueBooking.contact_person.ilike(f"%{search}%"))
        )

    if venue and venue != "All Venues":
        query = query.filter(VenueBooking.venue == venue)

    if status and status != "All Statuses":
        query = query.filter(VenueBooking.status == status)

    bookings = query.order_by(VenueBooking.booking_date.desc()).offset(skip).limit(limit).all()

    result = []
    for booking in bookings:
        result.append({
            "id": booking.id,
            "case_id": booking.case_id,
            "case_number": booking.case.case_number,
            "deceased_name": f"{booking.case.first_name} {booking.case.last_name}",
            "venue": booking.venue,
            "booking_date": booking.booking_date,
            "booking_time": booking.booking_time,
            "duration_hours": booking.duration_hours,
            "contact_person": booking.contact_person,
            "contact_phone": booking.contact_phone,
            "contact_email": booking.contact_email,
            "cost": float(booking.cost) if booking.cost else 0.00,
            "status": booking.status,
            "special_requirements": booking.special_requirements,
            "setup_notes": booking.setup_notes,
            "is_paid": booking.is_paid,
            "created_at": booking.created_at,
            "updated_at": booking.updated_at,
        })

    return result


@router.get("/stats", response_model=dict)
def get_venue_booking_stats(db: Session = Depends(get_db)):
    """Get venue booking statistics"""
    total = db.query(VenueBooking).count()
    confirmed = db.query(VenueBooking).filter(VenueBooking.status == "Confirmed").count()
    tentative = db.query(VenueBooking).filter(VenueBooking.status == "Tentative").count()

    # Calculate total revenue
    revenue_result = db.query(func.sum(VenueBooking.cost)).scalar()
    total_revenue = float(revenue_result) if revenue_result else 0.00

    return {
        "total": total,
        "confirmed": confirmed,
        "tentative": tentative,
        "total_revenue": total_revenue,
    }


@router.get("/{booking_id}", response_model=VenueBookingResponse)
def get_venue_booking(booking_id: int, db: Session = Depends(get_db)):
    """Get a specific venue booking by ID"""
    booking = db.query(VenueBooking).filter(VenueBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Venue booking not found")
    return booking


@router.put("/{booking_id}", response_model=VenueBookingResponse)
def update_venue_booking(booking_id: int, booking_update: VenueBookingUpdate, db: Session = Depends(get_db)):
    """Update a venue booking"""
    db_booking = db.query(VenueBooking).filter(VenueBooking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Venue booking not found")

    # If updating case_id, verify the case exists
    if booking_update.case_id is not None:
        case = db.query(Case).filter(Case.id == booking_update.case_id).first()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")

    update_data = booking_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_booking, field, value)

    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.delete("/{booking_id}")
def delete_venue_booking(booking_id: int, db: Session = Depends(get_db)):
    """Delete a venue booking"""
    db_booking = db.query(VenueBooking).filter(VenueBooking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Venue booking not found")

    db.delete(db_booking)
    db.commit()
    return {"message": "Venue booking deleted successfully"}
