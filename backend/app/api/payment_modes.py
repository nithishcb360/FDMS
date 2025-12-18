from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.payment_mode import PaymentMode
from ..schemas.payment_mode import PaymentModeCreate, PaymentModeUpdate, PaymentModeResponse

router = APIRouter()


@router.get("/", response_model=List[PaymentModeResponse])
def get_payment_modes(db: Session = Depends(get_db)):
    """Get all payment modes"""
    payment_modes = db.query(PaymentMode).all()
    return payment_modes


@router.get("/{payment_mode_id}", response_model=PaymentModeResponse)
def get_payment_mode(payment_mode_id: int, db: Session = Depends(get_db)):
    """Get a payment mode by ID"""
    payment_mode = db.query(PaymentMode).filter(PaymentMode.id == payment_mode_id).first()
    if not payment_mode:
        raise HTTPException(status_code=404, detail="Payment mode not found")
    return payment_mode


@router.post("/", response_model=PaymentModeResponse)
def create_payment_mode(payment_mode: PaymentModeCreate, db: Session = Depends(get_db)):
    """Create a new payment mode"""
    db_payment_mode = PaymentMode(**payment_mode.model_dump())
    db.add(db_payment_mode)
    db.commit()
    db.refresh(db_payment_mode)
    return db_payment_mode


@router.put("/{payment_mode_id}", response_model=PaymentModeResponse)
def update_payment_mode(payment_mode_id: int, payment_mode: PaymentModeUpdate, db: Session = Depends(get_db)):
    """Update a payment mode"""
    db_payment_mode = db.query(PaymentMode).filter(PaymentMode.id == payment_mode_id).first()
    if not db_payment_mode:
        raise HTTPException(status_code=404, detail="Payment mode not found")

    # Update fields
    update_data = payment_mode.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_payment_mode, field, value)

    db.commit()
    db.refresh(db_payment_mode)
    return db_payment_mode


@router.delete("/{payment_mode_id}")
def delete_payment_mode(payment_mode_id: int, db: Session = Depends(get_db)):
    """Delete a payment mode"""
    db_payment_mode = db.query(PaymentMode).filter(PaymentMode.id == payment_mode_id).first()
    if not db_payment_mode:
        raise HTTPException(status_code=404, detail="Payment mode not found")

    db.delete(db_payment_mode)
    db.commit()
    return {"message": "Payment mode deleted successfully"}
