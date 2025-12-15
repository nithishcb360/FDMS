from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.supplier import Supplier
from ..schemas.supplier import SupplierCreate, SupplierUpdate, SupplierResponse

router = APIRouter()


@router.get("/", response_model=List[SupplierResponse])
def get_suppliers(db: Session = Depends(get_db)):
    """Get all suppliers"""
    suppliers = db.query(Supplier).all()
    return suppliers


@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Get a supplier by ID"""
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier


@router.post("/", response_model=SupplierResponse)
def create_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    """Create a new supplier"""
    # Auto-generate supplier_id if not provided
    supplier_data = supplier.model_dump()
    if not supplier_data.get('supplier_id'):
        # Generate supplier_id (e.g., "SUP-2025-0001")
        supplier_count = db.query(Supplier).count()
        supplier_data['supplier_id'] = f"SUP-2025-{str(supplier_count + 1).zfill(4)}"

    # Check if supplier_id already exists
    existing = db.query(Supplier).filter(Supplier.supplier_id == supplier_data['supplier_id']).first()
    if existing:
        raise HTTPException(status_code=400, detail="Supplier ID already exists")

    db_supplier = Supplier(**supplier_data)
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier


@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_supplier(supplier_id: int, supplier: SupplierUpdate, db: Session = Depends(get_db)):
    """Update a supplier"""
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not db_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    # Check if updating supplier_id to an existing one
    if supplier.supplier_id and supplier.supplier_id != db_supplier.supplier_id:
        existing = db.query(Supplier).filter(Supplier.supplier_id == supplier.supplier_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Supplier ID already exists")

    # Update fields
    update_data = supplier.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_supplier, field, value)

    db.commit()
    db.refresh(db_supplier)
    return db_supplier


@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Delete a supplier"""
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not db_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    db.delete(db_supplier)
    db.commit()
    return {"message": "Supplier deleted successfully"}
