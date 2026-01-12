from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.models.document_type import DocumentType
from app.models.document import Document
from app.schemas.document_type import (
    DocumentTypeCreate,
    DocumentTypeUpdate,
    DocumentTypeResponse,
    DocumentTypeStats
)

router = APIRouter(prefix="/api/document-types", tags=["document-types"])

@router.get("/stats", response_model=DocumentTypeStats)
def get_document_type_stats(db: Session = Depends(get_db)):
    """Get document type statistics"""
    total_types = db.query(DocumentType).filter(DocumentType.is_deleted == False).count()
    active_types = db.query(DocumentType).filter(
        DocumentType.is_deleted == False,
        DocumentType.status == "Active"
    ).count()
    require_signature = db.query(DocumentType).filter(
        DocumentType.is_deleted == False,
        DocumentType.require_signature == True
    ).count()
    require_approval = db.query(DocumentType).filter(
        DocumentType.is_deleted == False,
        DocumentType.require_approval == True
    ).count()

    return {
        "total_types": total_types,
        "active_types": active_types,
        "require_signature": require_signature,
        "require_approval": require_approval
    }

@router.get("/", response_model=List[DocumentTypeResponse])
def get_document_types(
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all document types with optional filters"""
    query = db.query(DocumentType).filter(DocumentType.is_deleted == False)

    if search:
        query = query.filter(DocumentType.name.ilike(f"%{search}%"))

    if category and category != "All Categories":
        query = query.filter(DocumentType.category == category)

    if status and status != "All Statuses":
        query = query.filter(DocumentType.status == status)

    document_types = query.order_by(DocumentType.created_at.desc()).all()

    # Get document count for each type
    result = []
    for doc_type in document_types:
        doc_count = db.query(Document).filter(
            Document.document_type == doc_type.name,
            Document.is_deleted == False
        ).count()

        doc_type_dict = {
            "id": doc_type.id,
            "name": doc_type.name,
            "description": doc_type.description,
            "category": doc_type.category,
            "allowed_extensions": doc_type.allowed_extensions,
            "max_size_mb": doc_type.max_size_mb,
            "retention_years": doc_type.retention_years,
            "require_signature": doc_type.require_signature,
            "require_approval": doc_type.require_approval,
            "status": doc_type.status,
            "document_count": doc_count,
            "created_at": doc_type.created_at,
            "updated_at": doc_type.updated_at
        }
        result.append(doc_type_dict)

    return result

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """Get all unique categories"""
    categories = db.query(DocumentType.category).filter(
        DocumentType.is_deleted == False
    ).distinct().all()
    return [cat[0] for cat in categories]

@router.post("/", response_model=DocumentTypeResponse)
def create_document_type(
    document_type: DocumentTypeCreate,
    db: Session = Depends(get_db)
):
    """Create a new document type"""
    # Check if name already exists
    existing = db.query(DocumentType).filter(
        DocumentType.name == document_type.name,
        DocumentType.is_deleted == False
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Document type with this name already exists")

    db_document_type = DocumentType(**document_type.model_dump())
    db.add(db_document_type)
    db.commit()
    db.refresh(db_document_type)

    return {
        **document_type.model_dump(),
        "id": db_document_type.id,
        "document_count": 0,
        "created_at": db_document_type.created_at,
        "updated_at": db_document_type.updated_at
    }

@router.get("/{document_type_id}", response_model=DocumentTypeResponse)
def get_document_type(document_type_id: int, db: Session = Depends(get_db)):
    """Get a specific document type"""
    document_type = db.query(DocumentType).filter(
        DocumentType.id == document_type_id,
        DocumentType.is_deleted == False
    ).first()

    if not document_type:
        raise HTTPException(status_code=404, detail="Document type not found")

    doc_count = db.query(Document).filter(
        Document.document_type == document_type.name,
        Document.is_deleted == False
    ).count()

    return {
        "id": document_type.id,
        "name": document_type.name,
        "description": document_type.description,
        "category": document_type.category,
        "allowed_extensions": document_type.allowed_extensions,
        "max_size_mb": document_type.max_size_mb,
        "retention_years": document_type.retention_years,
        "require_signature": document_type.require_signature,
        "require_approval": document_type.require_approval,
        "status": document_type.status,
        "document_count": doc_count,
        "created_at": document_type.created_at,
        "updated_at": document_type.updated_at
    }

@router.put("/{document_type_id}", response_model=DocumentTypeResponse)
def update_document_type(
    document_type_id: int,
    document_type_update: DocumentTypeUpdate,
    db: Session = Depends(get_db)
):
    """Update a document type"""
    document_type = db.query(DocumentType).filter(
        DocumentType.id == document_type_id,
        DocumentType.is_deleted == False
    ).first()

    if not document_type:
        raise HTTPException(status_code=404, detail="Document type not found")

    # Check if new name conflicts with existing
    if document_type_update.name and document_type_update.name != document_type.name:
        existing = db.query(DocumentType).filter(
            DocumentType.name == document_type_update.name,
            DocumentType.is_deleted == False
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Document type with this name already exists")

    update_data = document_type_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(document_type, field, value)

    db.commit()
    db.refresh(document_type)

    doc_count = db.query(Document).filter(
        Document.document_type == document_type.name,
        Document.is_deleted == False
    ).count()

    return {
        "id": document_type.id,
        "name": document_type.name,
        "description": document_type.description,
        "category": document_type.category,
        "allowed_extensions": document_type.allowed_extensions,
        "max_size_mb": document_type.max_size_mb,
        "retention_years": document_type.retention_years,
        "require_signature": document_type.require_signature,
        "require_approval": document_type.require_approval,
        "status": document_type.status,
        "document_count": doc_count,
        "created_at": document_type.created_at,
        "updated_at": document_type.updated_at
    }

@router.delete("/{document_type_id}")
def delete_document_type(document_type_id: int, db: Session = Depends(get_db)):
    """Soft delete a document type"""
    document_type = db.query(DocumentType).filter(
        DocumentType.id == document_type_id,
        DocumentType.is_deleted == False
    ).first()

    if not document_type:
        raise HTTPException(status_code=404, detail="Document type not found")

    document_type.is_deleted = True
    db.commit()

    return {"message": "Document type deleted successfully"}
