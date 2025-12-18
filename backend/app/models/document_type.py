from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class DocumentType(Base):
    __tablename__ = "document_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(500), nullable=False, unique=True)
    description = Column(String(1000), nullable=True)
    category = Column(String(200), nullable=False)

    # Restrictions
    allowed_extensions = Column(String(500), nullable=True)  # e.g., "pdf,jpg,doc"
    max_size_mb = Column(Integer, nullable=True)  # Max file size in MB
    retention_years = Column(Integer, nullable=True)  # Retention period in years

    # Requirements
    require_signature = Column(Boolean, default=False)
    require_approval = Column(Boolean, default=False)

    status = Column(String(50), default="Active")
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
