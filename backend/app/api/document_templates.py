from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.models.document_template import DocumentTemplate
from app.models.document_type import DocumentType
from app.schemas.document_template import (
    DocumentTemplateCreate,
    DocumentTemplateUpdate,
    DocumentTemplateResponse,
    DocumentTemplateStats
)

router = APIRouter(prefix="/api/document-templates", tags=["document-templates"])

@router.get("/stats", response_model=DocumentTemplateStats)
def get_document_template_stats(db: Session = Depends(get_db)):
    """Get document template statistics"""
    total_templates = db.query(DocumentTemplate).filter(DocumentTemplate.is_deleted == False).count()
    active_templates = db.query(DocumentTemplate).filter(
        DocumentTemplate.is_deleted == False,
        DocumentTemplate.status == "Active"
    ).count()
    word_templates = db.query(DocumentTemplate).filter(
        DocumentTemplate.is_deleted == False,
        DocumentTemplate.template_type == "Word"
    ).count()
    pdf_templates = db.query(DocumentTemplate).filter(
        DocumentTemplate.is_deleted == False,
        DocumentTemplate.template_type == "PDF"
    ).count()

    return {
        "total_templates": total_templates,
        "active_templates": active_templates,
        "word_templates": word_templates,
        "pdf_templates": pdf_templates
    }

@router.get("/", response_model=List[DocumentTemplateResponse])
def get_document_templates(
    search: Optional[str] = None,
    template_type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all document templates with optional filters"""
    query = db.query(DocumentTemplate).filter(DocumentTemplate.is_deleted == False)

    if search:
        query = query.filter(DocumentTemplate.name.ilike(f"%{search}%"))

    if template_type and template_type != "All Types":
        query = query.filter(DocumentTemplate.template_type == template_type)

    if status and status != "All Statuses":
        query = query.filter(DocumentTemplate.status == status)

    templates = query.order_by(DocumentTemplate.created_at.desc()).all()

    # Get document type names
    result = []
    for template in templates:
        doc_type_name = None
        if template.document_type_id:
            doc_type = db.query(DocumentType).filter(DocumentType.id == template.document_type_id).first()
            if doc_type:
                doc_type_name = doc_type.name

        template_dict = {
            "id": template.id,
            "name": template.name,
            "template_type": template.template_type,
            "document_type_id": template.document_type_id,
            "content": template.content,
            "description": template.description,
            "status": template.status,
            "file_path": template.file_path,
            "document_type_name": doc_type_name,
            "created_at": template.created_at,
            "updated_at": template.updated_at
        }
        result.append(template_dict)

    return result

@router.get("/types")
def get_template_types(db: Session = Depends(get_db)):
    """Get all unique template types"""
    types = db.query(DocumentTemplate.template_type).filter(
        DocumentTemplate.is_deleted == False
    ).distinct().all()
    return [t[0] for t in types]

@router.post("/", response_model=DocumentTemplateResponse)
def create_document_template(
    template: DocumentTemplateCreate,
    db: Session = Depends(get_db)
):
    """Create a new document template"""
    db_template = DocumentTemplate(**template.model_dump())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)

    doc_type_name = None
    if db_template.document_type_id:
        doc_type = db.query(DocumentType).filter(DocumentType.id == db_template.document_type_id).first()
        if doc_type:
            doc_type_name = doc_type.name

    return {
        **template.model_dump(),
        "id": db_template.id,
        "file_path": db_template.file_path,
        "document_type_name": doc_type_name,
        "created_at": db_template.created_at,
        "updated_at": db_template.updated_at
    }

@router.get("/{template_id}", response_model=DocumentTemplateResponse)
def get_document_template(template_id: int, db: Session = Depends(get_db)):
    """Get a specific document template"""
    template = db.query(DocumentTemplate).filter(
        DocumentTemplate.id == template_id,
        DocumentTemplate.is_deleted == False
    ).first()

    if not template:
        raise HTTPException(status_code=404, detail="Document template not found")

    doc_type_name = None
    if template.document_type_id:
        doc_type = db.query(DocumentType).filter(DocumentType.id == template.document_type_id).first()
        if doc_type:
            doc_type_name = doc_type.name

    return {
        "id": template.id,
        "name": template.name,
        "template_type": template.template_type,
        "document_type_id": template.document_type_id,
        "content": template.content,
        "description": template.description,
        "status": template.status,
        "file_path": template.file_path,
        "document_type_name": doc_type_name,
        "created_at": template.created_at,
        "updated_at": template.updated_at
    }

@router.put("/{template_id}", response_model=DocumentTemplateResponse)
def update_document_template(
    template_id: int,
    template_update: DocumentTemplateUpdate,
    db: Session = Depends(get_db)
):
    """Update a document template"""
    template = db.query(DocumentTemplate).filter(
        DocumentTemplate.id == template_id,
        DocumentTemplate.is_deleted == False
    ).first()

    if not template:
        raise HTTPException(status_code=404, detail="Document template not found")

    update_data = template_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(template, field, value)

    db.commit()
    db.refresh(template)

    doc_type_name = None
    if template.document_type_id:
        doc_type = db.query(DocumentType).filter(DocumentType.id == template.document_type_id).first()
        if doc_type:
            doc_type_name = doc_type.name

    return {
        "id": template.id,
        "name": template.name,
        "template_type": template.template_type,
        "document_type_id": template.document_type_id,
        "content": template.content,
        "description": template.description,
        "status": template.status,
        "file_path": template.file_path,
        "document_type_name": doc_type_name,
        "created_at": template.created_at,
        "updated_at": template.updated_at
    }

@router.delete("/{template_id}")
def delete_document_template(template_id: int, db: Session = Depends(get_db)):
    """Soft delete a document template"""
    template = db.query(DocumentTemplate).filter(
        DocumentTemplate.id == template_id,
        DocumentTemplate.is_deleted == False
    ).first()

    if not template:
        raise HTTPException(status_code=404, detail="Document template not found")

    template.is_deleted = True
    db.commit()

    return {"message": "Document template deleted successfully"}
