from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.tax_code import TaxCode
from ..schemas.tax_code import TaxCodeCreate, TaxCodeUpdate, TaxCodeResponse

router = APIRouter()


@router.get("/", response_model=List[TaxCodeResponse])
def get_tax_codes(db: Session = Depends(get_db)):
    """Get all tax codes"""
    tax_codes = db.query(TaxCode).all()
    return tax_codes


@router.get("/{tax_code_id}", response_model=TaxCodeResponse)
def get_tax_code(tax_code_id: int, db: Session = Depends(get_db)):
    """Get a tax code by ID"""
    tax_code = db.query(TaxCode).filter(TaxCode.id == tax_code_id).first()
    if not tax_code:
        raise HTTPException(status_code=404, detail="Tax code not found")
    return tax_code


@router.post("/", response_model=TaxCodeResponse)
def create_tax_code(tax_code: TaxCodeCreate, db: Session = Depends(get_db)):
    """Create a new tax code"""
    # Check if tax code already exists
    existing = db.query(TaxCode).filter(TaxCode.tax_code == tax_code.tax_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tax code already exists")

    db_tax_code = TaxCode(**tax_code.model_dump())
    db.add(db_tax_code)
    db.commit()
    db.refresh(db_tax_code)
    return db_tax_code


@router.put("/{tax_code_id}", response_model=TaxCodeResponse)
def update_tax_code(tax_code_id: int, tax_code: TaxCodeUpdate, db: Session = Depends(get_db)):
    """Update a tax code"""
    db_tax_code = db.query(TaxCode).filter(TaxCode.id == tax_code_id).first()
    if not db_tax_code:
        raise HTTPException(status_code=404, detail="Tax code not found")

    # Update fields
    update_data = tax_code.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_tax_code, field, value)

    db.commit()
    db.refresh(db_tax_code)
    return db_tax_code


@router.delete("/{tax_code_id}")
def delete_tax_code(tax_code_id: int, db: Session = Depends(get_db)):
    """Delete a tax code"""
    db_tax_code = db.query(TaxCode).filter(TaxCode.id == tax_code_id).first()
    if not db_tax_code:
        raise HTTPException(status_code=404, detail="Tax code not found")

    db.delete(db_tax_code)
    db.commit()
    return {"message": "Tax code deleted successfully"}
