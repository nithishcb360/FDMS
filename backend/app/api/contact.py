from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.contact import Contact
from ..models.user import User
from ..schemas.contact import ContactCreate, ContactResponse

router = APIRouter(prefix="/contacts", tags=["contacts"])


@router.post("/", response_model=ContactResponse)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new contact submission"""
    db_contact = Contact(**contact.dict(), user_id=current_user.id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.get("/", response_model=List[ContactResponse])
def get_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all contact submissions"""
    query = db.query(Contact)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Contact.user_id == current_user.id)

    contacts = query.offset(skip).limit(limit).all()
    return contacts


@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(contact_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a specific contact submission"""
    query = db.query(Contact).filter(Contact.id == contact_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Contact.user_id == current_user.id)

    contact = query.first()
    if contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact
