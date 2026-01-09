from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.invoice import Invoice
from app.models.user import User
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceResponse

router = APIRouter()

@router.get("/stats")
def get_invoice_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Invoice)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Invoice.user_id == current_user.id)

    total_invoices = query.count()
    total_revenue = query.with_entities(func.sum(Invoice.total_amount)).scalar() or 0.0
    outstanding = query.filter(Invoice.balance > 0).with_entities(func.sum(Invoice.balance)).scalar() or 0.0
    overdue = query.filter(
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Invoice)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Invoice.user_id == current_user.id)

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
def get_invoice(invoice_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Invoice).filter(Invoice.id == invoice_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Invoice.user_id == current_user.id)

    invoice = query.first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.post("/", response_model=InvoiceResponse)
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if invoice number already exists
    existing = db.query(Invoice).filter(Invoice.invoice_number == invoice.invoice_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Invoice number already exists")

    db_invoice = Invoice(**invoice.model_dump(), user_id=current_user.id)
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.put("/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(invoice_id: int, invoice: InvoiceUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Invoice).filter(Invoice.id == invoice_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Invoice.user_id == current_user.id)

    db_invoice = query.first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    update_data = invoice.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_invoice, field, value)

    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.delete("/{invoice_id}")
def delete_invoice(invoice_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Invoice).filter(Invoice.id == invoice_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Invoice.user_id == current_user.id)

    db_invoice = query.first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    db.delete(db_invoice)
    db.commit()
    return {"message": "Invoice deleted successfully"}
