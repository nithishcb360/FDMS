from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentTypeBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    allowed_extensions: Optional[str] = None
    max_size_mb: Optional[int] = None
    retention_years: Optional[int] = None
    require_signature: bool = False
    require_approval: bool = False
    status: str = "Active"

class DocumentTypeCreate(DocumentTypeBase):
    pass


class DocumentTypeUpdate(BaseModel):
    document_type: Optional[str] = None
    type_code: Optional[str] = None
    display_name: Optional[str] = None
    description: Optional[str] = None
    is_mandatory: Optional[bool] = None
    has_expiry: Optional[bool] = None
    has_template: Optional[bool] = None
    template_file_path: Optional[str] = None
    is_active: Optional[bool] = None


class DocumentTypeResponse(DocumentTypeBase):
    id: int
    created_at: Optional[datetime] = None
class DocumentTypeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    allowed_extensions: Optional[str] = None
    max_size_mb: Optional[int] = None
    retention_years: Optional[int] = None
    require_signature: Optional[bool] = None
    require_approval: Optional[bool] = None
    status: Optional[str] = None

class DocumentTypeResponse(DocumentTypeBase):
    id: int
    document_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DocumentTypeStats(BaseModel):
    total_types: int
    active_types: int
    require_signature: int
    require_approval: int
