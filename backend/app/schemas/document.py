from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None
    document_type: str
    file_name: str
    file_path: str
    file_size: int
    file_type: str
    mime_type: Optional[str] = None
    case_id: Optional[int] = None
    client_name: Optional[str] = None
    status: Optional[str] = "Draft"
    visibility: Optional[str] = "Private"
    tags: Optional[str] = None
    uploaded_by: Optional[str] = None
    is_deleted: Optional[bool] = False


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    document_type: Optional[str] = None
    case_id: Optional[int] = None
    client_name: Optional[str] = None
    status: Optional[str] = None
    visibility: Optional[str] = None
    tags: Optional[str] = None
    uploaded_by: Optional[str] = None
    is_deleted: Optional[bool] = None


class DocumentResponse(DocumentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
