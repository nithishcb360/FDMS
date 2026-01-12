from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_
from typing import List, Optional
import os
import shutil
from pathlib import Path

from app.core.database import get_db
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentResponse

router = APIRouter()

# Configure upload directory
UPLOAD_DIR = Path("uploads/documents")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Query(...),
    document_type: str = Query(...),
    description: Optional[str] = Query(None),
    case_id: Optional[int] = Query(None),
    client_name: Optional[str] = Query(None),
    status: str = Query("Draft"),
    visibility: str = Query("Private"),
    tags: Optional[str] = Query(None),
    uploaded_by: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Upload a new document"""
    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{title.replace(' ', '_')}_{func.now()}_{file.filename}"
        file_path = UPLOAD_DIR / unique_filename

        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Get file size
        file_size = os.path.getsize(file_path)

        # Create document record
        document = Document(
            title=title,
            description=description,
            document_type=document_type,
            file_name=file.filename,
            file_path=str(file_path),
            file_size=file_size,
            file_type=file_extension.lstrip('.').upper(),
            mime_type=file.content_type,
            case_id=case_id,
            client_name=client_name,
            status=status,
            visibility=visibility,
            tags=tags,
            uploaded_by=uploaded_by
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[DocumentResponse])
@router.get("", response_model=List[DocumentResponse])
def get_documents(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    document_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    visibility: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all documents with optional filters"""
    query = db.query(Document).filter(Document.is_deleted == False)

    # Apply filters
    if search:
        query = query.filter(
            or_(
                Document.title.ilike(f"%{search}%"),
                Document.description.ilike(f"%{search}%"),
                Document.tags.ilike(f"%{search}%"),
                Document.client_name.ilike(f"%{search}%")
            )
        )

    if document_type and document_type != "All Types":
        query = query.filter(Document.document_type == document_type)

    if status and status != "All Statuses":
        query = query.filter(Document.status == status)

    if visibility and visibility != "All":
        query = query.filter(Document.visibility == visibility)

    documents = query.order_by(desc(Document.created_at)).offset(skip).limit(limit).all()
    return documents


@router.get("/stats", response_model=dict)
def get_document_stats(db: Session = Depends(get_db)):
    """Get document statistics"""
    total = db.query(Document).filter(Document.is_deleted == False).count()
    draft = db.query(Document).filter(
        Document.status == "Draft",
        Document.is_deleted == False
    ).count()
    approved = db.query(Document).filter(
        Document.status == "Approved",
        Document.is_deleted == False
    ).count()

    # Calculate total storage (in MB)
    total_size_query = db.query(func.sum(Document.file_size)).filter(
        Document.is_deleted == False
    ).scalar()
    total_storage_mb = (total_size_query or 0) / (1024 * 1024)

    return {
        "total": total,
        "draft": draft,
        "approved": approved,
        "total_storage_mb": round(total_storage_mb, 2),
    }


@router.get("/types", response_model=List[str])
def get_document_types(db: Session = Depends(get_db)):
    """Get all unique document types"""
    types = db.query(Document.document_type).distinct().filter(
        Document.document_type.isnot(None),
        Document.is_deleted == False
    ).all()
    return [t[0] for t in types if t[0]]


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get a specific document by ID"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.is_deleted == False
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    document_update: DocumentUpdate,
    db: Session = Depends(get_db)
):
    """Update a document"""
    db_document = db.query(Document).filter(
        Document.id == document_id,
        Document.is_deleted == False
    ).first()
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")

    update_data = document_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_document, field, value)

    db.commit()
    db.refresh(db_document)
    return db_document


@router.delete("/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    """Soft delete a document"""
    db_document = db.query(Document).filter(
        Document.id == document_id,
        Document.is_deleted == False
    ).first()
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Soft delete
    db_document.is_deleted = True
    db.commit()
    return {"message": "Document deleted successfully"}


@router.get("/{document_id}/download")
def download_document(document_id: int, db: Session = Depends(get_db)):
    """Get document download URL"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.is_deleted == False
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "file_path": document.file_path,
        "file_name": document.file_name,
        "mime_type": document.mime_type
    }
