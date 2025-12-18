from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.service_type import ServiceType
from ..schemas.service_type import ServiceTypeCreate, ServiceTypeUpdate, ServiceTypeResponse

router = APIRouter()


@router.get("/", response_model=List[ServiceTypeResponse])
def get_service_types(db: Session = Depends(get_db)):
    """Get all service types"""
    service_types = db.query(ServiceType).all()
    return service_types


@router.get("/{service_type_id}", response_model=ServiceTypeResponse)
def get_service_type(service_type_id: int, db: Session = Depends(get_db)):
    """Get a service type by ID"""
    service_type = db.query(ServiceType).filter(ServiceType.id == service_type_id).first()
    if not service_type:
        raise HTTPException(status_code=404, detail="Service type not found")
    return service_type


@router.post("/", response_model=ServiceTypeResponse)
def create_service_type(service_type: ServiceTypeCreate, db: Session = Depends(get_db)):
    """Create a new service type"""
    db_service_type = ServiceType(**service_type.model_dump())
    db.add(db_service_type)
    db.commit()
    db.refresh(db_service_type)
    return db_service_type


@router.put("/{service_type_id}", response_model=ServiceTypeResponse)
def update_service_type(service_type_id: int, service_type: ServiceTypeUpdate, db: Session = Depends(get_db)):
    """Update a service type"""
    db_service_type = db.query(ServiceType).filter(ServiceType.id == service_type_id).first()
    if not db_service_type:
        raise HTTPException(status_code=404, detail="Service type not found")

    # Update fields
    update_data = service_type.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_service_type, field, value)

    db.commit()
    db.refresh(db_service_type)
    return db_service_type


@router.delete("/{service_type_id}")
def delete_service_type(service_type_id: int, db: Session = Depends(get_db)):
    """Delete a service type"""
    db_service_type = db.query(ServiceType).filter(ServiceType.id == service_type_id).first()
    if not db_service_type:
        raise HTTPException(status_code=404, detail="Service type not found")

    db.delete(db_service_type)
    db.commit()
    return {"message": "Service type deleted successfully"}
