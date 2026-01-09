from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.case_note import CaseNote
from app.models.user import User
from app.schemas.case_note import CaseNoteCreate, CaseNoteUpdate, CaseNoteResponse

router = APIRouter()


@router.post("/", response_model=CaseNoteResponse)
@router.post("", response_model=CaseNoteResponse)
def create_case_note(note: CaseNoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new case note"""
    db_note = CaseNote(**note.model_dump(), user_id=current_user.id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.get("/", response_model=List[CaseNoteResponse])
@router.get("", response_model=List[CaseNoteResponse])
def get_case_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all case notes"""
    query = db.query(CaseNote)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(CaseNote.user_id == current_user.id)

    notes = query.order_by(CaseNote.created_at.desc()).offset(skip).limit(limit).all()
    return notes


@router.get("/{note_id}", response_model=CaseNoteResponse)
def get_case_note_by_id(note_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a specific case note by ID"""
    query = db.query(CaseNote).filter(CaseNote.id == note_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(CaseNote.user_id == current_user.id)

    note = query.first()
    if not note:
        raise HTTPException(status_code=404, detail="Case note not found")
    return note


@router.get("/by-case/{case_number}", response_model=List[CaseNoteResponse])
def get_case_notes_by_case(case_number: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all case notes for a specific case"""
    query = db.query(CaseNote).filter(CaseNote.case_number == case_number)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(CaseNote.user_id == current_user.id)

    notes = query.order_by(CaseNote.created_at.desc()).all()
    return notes


@router.put("/{note_id}", response_model=CaseNoteResponse)
def update_case_note(note_id: int, note_update: CaseNoteUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a case note"""
    query = db.query(CaseNote).filter(CaseNote.id == note_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(CaseNote.user_id == current_user.id)

    db_note = query.first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Case note not found")

    update_data = note_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_note, field, value)

    db.commit()
    db.refresh(db_note)
    return db_note


@router.delete("/{note_id}")
def delete_case_note(note_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a case note"""
    query = db.query(CaseNote).filter(CaseNote.id == note_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(CaseNote.user_id == current_user.id)

    db_note = query.first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Case note not found")

    db.delete(db_note)
    db.commit()
    return {"message": "Case note deleted successfully", "id": note_id}
