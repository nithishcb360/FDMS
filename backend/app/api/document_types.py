from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.document_type import DocumentType
from ..schemas.document_type import DocumentTypeCreate, DocumentTypeUpdate, DocumentTypeResponse

router = APIRouter()


@router.get("/", response_model=List[DocumentTypeResponse])
def get_document_types(db: Session = Depends(get_db)):
    """Get all document types"""
    document_types = db.query(DocumentType).all()
    return document_types


@router.get("/{document_type_id}", response_model=DocumentTypeResponse)
def get_document_type(document_type_id: int, db: Session = Depends(get_db)):
    """Get a document type by ID"""
    document_type = db.query(DocumentType).filter(DocumentType.id == document_type_id).first()
    if not document_type:
        raise HTTPException(status_code=404, detail="Document type not found")
    return document_type


@router.post("/", response_model=DocumentTypeResponse)
def create_document_type(document_type: DocumentTypeCreate, db: Session = Depends(get_db)):
    """Create a new document type"""
    # Check if type_code already exists
    existing = db.query(DocumentType).filter(DocumentType.type_code == document_type.type_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Document type code already exists")

    db_document_type = DocumentType(**document_type.model_dump())
    db.add(db_document_type)
    db.commit()
    db.refresh(db_document_type)
    return db_document_type


@router.put("/{document_type_id}", response_model=DocumentTypeResponse)
def update_document_type(document_type_id: int, document_type: DocumentTypeUpdate, db: Session = Depends(get_db)):
    """Update a document type"""
    db_document_type = db.query(DocumentType).filter(DocumentType.id == document_type_id).first()
    if not db_document_type:
        raise HTTPException(status_code=404, detail="Document type not found")

    # Update fields
    update_data = document_type.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_document_type, field, value)

    db.commit()
    db.refresh(db_document_type)
    return db_document_type


@router.delete("/{document_type_id}")
def delete_document_type(document_type_id: int, db: Session = Depends(get_db)):
    """Delete a document type"""
    db_document_type = db.query(DocumentType).filter(DocumentType.id == document_type_id).first()
    if not db_document_type:
        raise HTTPException(status_code=404, detail="Document type not found")

    db.delete(db_document_type)
    db.commit()
    return {"message": "Document type deleted successfully"}
