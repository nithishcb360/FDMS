from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentTemplateBase(BaseModel):
    name: str
    template_type: str
    document_type_id: Optional[int] = None
    content: Optional[str] = None
    description: Optional[str] = None
    status: str = "Active"

class DocumentTemplateCreate(DocumentTemplateBase):
    pass

class DocumentTemplateUpdate(BaseModel):
    name: Optional[str] = None
    template_type: Optional[str] = None
    document_type_id: Optional[int] = None
    content: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class DocumentTemplateResponse(DocumentTemplateBase):
    id: int
    file_path: Optional[str] = None
    document_type_name: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DocumentTemplateStats(BaseModel):
    total_templates: int
    active_templates: int
    word_templates: int
    pdf_templates: int
