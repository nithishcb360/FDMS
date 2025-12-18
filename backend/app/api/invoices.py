from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceResponse

router = APIRouter()

@router.get("/stats")
def get_invoice_stats(db: Session = Depends(get_db)):
    total_invoices = db.query(Invoice).count()
    total_revenue = db.query(func.sum(Invoice.total_amount)).scalar() or 0.0
    outstanding = db.query(func.sum(Invoice.balance)).filter(Invoice.balance > 0).scalar() or 0.0
    overdue = db.query(Invoice).filter(
        Invoice.balance > 0,
        Invoice.due_date < func.current_date()
    ).count()

    return {
        "total_invoices": total_invoices,
        "total_revenue": round(total_revenue, 2),
        "outstanding": round(outstanding, 2),
        "overdue": overdue
    }

@router.get("/", response_model=List[InvoiceResponse])
def get_invoices(
    search: Optional[str] = None,
    status: Optional[str] = None,
    branch: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Invoice)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Invoice.invoice_number.ilike(search_filter)) |
            (Invoice.client_name.ilike(search_filter))
        )

    if status:
        query = query.filter(Invoice.status == status)

    if branch:
        query = query.filter(Invoice.branch == branch)

    return query.order_by(Invoice.created_at.desc()).all()

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.post("/", response_model=InvoiceResponse)
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    # Check if invoice number already exists
    existing = db.query(Invoice).filter(Invoice.invoice_number == invoice.invoice_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Invoice number already exists")

    db_invoice = Invoice(**invoice.model_dump())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.put("/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(invoice_id: int, invoice: InvoiceUpdate, db: Session = Depends(get_db)):
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    update_data = invoice.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_invoice, field, value)

    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.delete("/{invoice_id}")
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    db.delete(db_invoice)
    db.commit()
    return {"message": "Invoice deleted successfully"}
