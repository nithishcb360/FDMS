from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DocumentTypeBase(BaseModel):
    document_type: str
    type_code: str
    display_name: str
    description: Optional[str] = None
    is_mandatory: bool = False
    has_expiry: bool = False
    has_template: bool = False
    template_file_path: Optional[str] = None
    is_active: bool = True


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
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
