from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentUpdate, PaymentResponse

router = APIRouter()

@router.get("/stats")
def get_payment_stats(db: Session = Depends(get_db)):
    total_payments = db.query(Payment).count()
    total_received = db.query(func.sum(Payment.amount)).filter(
        Payment.status.in_(["Completed", "Cleared"])
    ).scalar() or 0.0
    pending = db.query(Payment).filter(Payment.status == "Pending").count()
    processing = db.query(Payment).filter(Payment.status == "Processing").count()

    return {
        "total_payments": total_payments,
        "total_received": round(total_received, 2),
        "pending": pending,
        "processing": processing
    }

@router.get("/", response_model=List[PaymentResponse])
def get_payments(
    search: Optional[str] = None,
    status: Optional[str] = None,
    payment_method: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Payment)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Payment.payment_number.ilike(search_filter)) |
            (Payment.payer_name.ilike(search_filter)) |
            (Payment.invoice_number.ilike(search_filter))
        )

    if status:
        query = query.filter(Payment.status == status)

    if payment_method:
        query = query.filter(Payment.payment_method == payment_method)

    return query.order_by(Payment.created_at.desc()).all()

@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.post("/", response_model=PaymentResponse)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    # Auto-generate payment number
    latest_payment = db.query(Payment).order_by(Payment.id.desc()).first()
    if latest_payment and latest_payment.payment_number:
        # Extract number from PAY-001 format
        try:
            last_num = int(latest_payment.payment_number.split('-')[-1])
            payment_number = f"PAY-{str(last_num + 1).zfill(3)}"
        except:
            payment_number = f"PAY-{str(db.query(Payment).count() + 1).zfill(3)}"
    else:
        payment_number = "PAY-001"

    payment_data = payment.model_dump()
    payment_data['payment_number'] = payment_number

    db_payment = Payment(**payment_data)
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.put("/{payment_id}", response_model=PaymentResponse)
def update_payment(payment_id: int, payment: PaymentUpdate, db: Session = Depends(get_db)):
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    update_data = payment.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_payment, field, value)

    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.delete("/{payment_id}")
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    db.delete(db_payment)
    db.commit()
    return {"message": "Payment deleted successfully"}
