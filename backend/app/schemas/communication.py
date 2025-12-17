from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CommunicationBase(BaseModel):
    family_id: Optional[int] = None
    family_name: Optional[str] = None
    case_id: Optional[int] = None
    case_number: Optional[str] = None
    type: str
    direction: str
    status: str = "Sent"
    subject: Optional[str] = None
    message: str
    response: Optional[str] = None
    has_attachments: bool = False
    attachment_count: int = 0

class CommunicationCreate(BaseModel):
    family_id: Optional[int] = None
    family_name: Optional[str] = None
    case_id: Optional[int] = None
    case_number: Optional[str] = None
    type: str
    direction: str
    status: str = "Sent"
    subject: Optional[str] = None
    message: str
    response: Optional[str] = None
    has_attachments: bool = False
    attachment_count: int = 0

class CommunicationUpdate(BaseModel):
    family_id: Optional[int] = None
    family_name: Optional[str] = None
    case_id: Optional[int] = None
    case_number: Optional[str] = None
    type: Optional[str] = None
    direction: Optional[str] = None
    status: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    response: Optional[str] = None
    has_attachments: Optional[bool] = None
    attachment_count: Optional[int] = None

class CommunicationResponse(CommunicationBase):
    id: int
    communication_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
