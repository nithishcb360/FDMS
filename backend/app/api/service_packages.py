from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.service_package import ServicePackage
from ..schemas.service_package import ServicePackageCreate, ServicePackageUpdate, ServicePackageResponse

router = APIRouter()


@router.get("/", response_model=List[ServicePackageResponse])
def get_service_packages(db: Session = Depends(get_db)):
    """Get all service packages"""
    packages = db.query(ServicePackage).all()
    return packages


@router.get("/{package_id}", response_model=ServicePackageResponse)
def get_service_package(package_id: int, db: Session = Depends(get_db)):
    """Get a service package by ID"""
    package = db.query(ServicePackage).filter(ServicePackage.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Service package not found")
    return package


@router.post("/", response_model=ServicePackageResponse)
def create_service_package(package: ServicePackageCreate, db: Session = Depends(get_db)):
    """Create a new service package"""
    db_package = ServicePackage(**package.model_dump())
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package


@router.put("/{package_id}", response_model=ServicePackageResponse)
def update_service_package(package_id: int, package: ServicePackageUpdate, db: Session = Depends(get_db)):
    """Update a service package"""
    db_package = db.query(ServicePackage).filter(ServicePackage.id == package_id).first()
    if not db_package:
        raise HTTPException(status_code=404, detail="Service package not found")

    # Update fields
    update_data = package.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_package, field, value)

    db.commit()
    db.refresh(db_package)
    return db_package


@router.delete("/{package_id}")
def delete_service_package(package_id: int, db: Session = Depends(get_db)):
    """Delete a service package"""
    db_package = db.query(ServicePackage).filter(ServicePackage.id == package_id).first()
    if not db_package:
        raise HTTPException(status_code=404, detail="Service package not found")

    db.delete(db_package)
    db.commit()
    return {"message": "Service package deleted successfully"}
