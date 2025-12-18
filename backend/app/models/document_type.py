from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from ..core.database import Base


class DocumentType(Base):
    __tablename__ = "document_types"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    document_type = Column(String(100), nullable=False)  # e.g., "Authorization Form", "Death Certificate"
    type_code = Column(String(50), unique=True, nullable=False)  # e.g., "Authorization Form", "Death Certificate"
    display_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    # Properties
    is_mandatory = Column(Boolean, default=False)
    has_expiry = Column(Boolean, default=False)

    # Template
    has_template = Column(Boolean, default=False)
    template_file_path = Column(String(500), nullable=True)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
