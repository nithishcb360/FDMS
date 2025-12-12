from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class CaseNote(Base):
    __tablename__ = "case_notes"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(50), ForeignKey("cases.case_number"), nullable=False, index=True)

    # Note Information
    note_type = Column(String(50), nullable=False)  # General Note, Follow-up Required, Important Notes, Issue Notes
    content = Column(Text, nullable=False)

    # Follow-up
    requires_follow_up = Column(Boolean, default=False)
    follow_up_date = Column(Date, nullable=True)

    # Privacy
    is_private = Column(Boolean, default=False)

    # Metadata
    created_by = Column(String(100), nullable=False)  # User who created the note

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
