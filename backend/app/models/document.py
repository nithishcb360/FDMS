from sqlalchemy import Column, Integer, String, DateTime, Boolean, BigInteger, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    # Document Information
    title = Column(String(500), nullable=False)
    description = Column(String(1000), nullable=True)
    document_type = Column(String(100), nullable=False)  # Contract, Invoice, Certificate, etc.

    # File Information
    file_name = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)
    file_size = Column(BigInteger, nullable=False)  # in bytes
    file_type = Column(String(100), nullable=False)  # PDF, DOCX, etc.
    mime_type = Column(String(200), nullable=True)

    # Association
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    client_name = Column(String(500), nullable=True)

    # Status & Visibility
    status = Column(String(50), default="Draft")  # Draft, Approved, Archived
    visibility = Column(String(50), default="Private")  # Private, Public, Internal

    # Tags & Metadata
    tags = Column(String(500), nullable=True)  # Comma-separated tags

    # Uploaded By
    uploaded_by = Column(String(200), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Soft Delete
    is_deleted = Column(Boolean, default=False)

    # Relationships
    case = relationship("Case", backref="documents", foreign_keys=[case_id])
