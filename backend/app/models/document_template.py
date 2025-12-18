from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class DocumentTemplate(Base):
    __tablename__ = "document_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(500), nullable=False)
    template_type = Column(String(100), nullable=False)  # Word, PDF, etc.
    document_type_id = Column(Integer, ForeignKey("document_types.id"), nullable=True)
    content = Column(Text, nullable=True)  # Template content/structure
    file_path = Column(String(1000), nullable=True)  # Path to template file
    description = Column(String(1000), nullable=True)
    status = Column(String(50), default="Active")
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
