from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.case_note import CaseNote
from app.schemas.case_note import CaseNoteCreate, CaseNoteUpdate, CaseNoteResponse

router = APIRouter()


@router.post("/", response_model=CaseNoteResponse)
@router.post("", response_model=CaseNoteResponse)
def create_case_note(note: CaseNoteCreate, db: Session = Depends(get_db)):
    """Create a new case note"""
    db_note = CaseNote(**note.model_dump())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.get("/", response_model=List[CaseNoteResponse])
@router.get("", response_model=List[CaseNoteResponse])
def get_case_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all case notes"""
    notes = db.query(CaseNote).order_by(CaseNote.created_at.desc()).offset(skip).limit(limit).all()
    return notes


@router.get("/{note_id}", response_model=CaseNoteResponse)
def get_case_note_by_id(note_id: int, db: Session = Depends(get_db)):
    """Get a specific case note by ID"""
    note = db.query(CaseNote).filter(CaseNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Case note not found")
    return note


@router.get("/by-case/{case_number}", response_model=List[CaseNoteResponse])
def get_case_notes_by_case(case_number: str, db: Session = Depends(get_db)):
    """Get all case notes for a specific case"""
    notes = db.query(CaseNote).filter(CaseNote.case_number == case_number).order_by(CaseNote.created_at.desc()).all()
    return notes


@router.put("/{note_id}", response_model=CaseNoteResponse)
def update_case_note(note_id: int, note_update: CaseNoteUpdate, db: Session = Depends(get_db)):
    """Update a case note"""
    db_note = db.query(CaseNote).filter(CaseNote.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Case note not found")

    update_data = note_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_note, field, value)

    db.commit()
    db.refresh(db_note)
    return db_note


@router.delete("/{note_id}")
def delete_case_note(note_id: int, db: Session = Depends(get_db)):
    """Delete a case note"""
    db_note = db.query(CaseNote).filter(CaseNote.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Case note not found")

    db.delete(db_note)
    db.commit()
    return {"message": "Case note deleted successfully", "id": note_id}
