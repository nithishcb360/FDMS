from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.core.database import get_db
from app.models.service_addon import ServiceAddon
from app.schemas.service_addon import ServiceAddonCreate, ServiceAddonUpdate, ServiceAddonResponse

router = APIRouter()


@router.post("/", response_model=ServiceAddonResponse)
@router.post("", response_model=ServiceAddonResponse)
def create_service_addon(addon: ServiceAddonCreate, db: Session = Depends(get_db)):
    """Create a new service add-on"""
    db_addon = ServiceAddon(**addon.model_dump())
    db.add(db_addon)
    db.commit()
    db.refresh(db_addon)
    return db_addon


@router.get("/", response_model=List[ServiceAddonResponse])
@router.get("", response_model=List[ServiceAddonResponse])
def get_service_addons(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all service add-ons with optional filters"""
    query = db.query(ServiceAddon)

    # Apply filters
    if search:
        query = query.filter(
            (ServiceAddon.name.ilike(f"%{search}%")) |
            (ServiceAddon.description.ilike(f"%{search}%"))
        )

    if category and category != "All Categories":
        query = query.filter(ServiceAddon.category == category)

    if status and status != "All Statuses":
        # Map old status names to is_active boolean
        if status == "Active":
            query = query.filter(ServiceAddon.is_active == True)
        elif status == "Inactive":
            query = query.filter(ServiceAddon.is_active == False)

    addons = query.order_by(ServiceAddon.display_order, ServiceAddon.name).offset(skip).limit(limit).all()
    return addons


@router.get("/stats", response_model=dict)
def get_service_addon_stats(db: Session = Depends(get_db)):
    """Get service add-on statistics"""
    total = db.query(ServiceAddon).count()
    active = db.query(ServiceAddon).filter(ServiceAddon.is_active == True).count()

    # Count unique categories
    categories = db.query(func.count(func.distinct(ServiceAddon.category))).scalar()

    # Calculate average price
    avg_price_result = db.query(func.avg(ServiceAddon.unit_price)).scalar()
    avg_price = float(avg_price_result) if avg_price_result else 0.00

    return {
        "total": total,
        "active": active,
        "categories": categories or 0,
        "avg_price": avg_price,
    }


@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    """Get all unique categories"""
    categories = db.query(ServiceAddon.category).distinct().filter(ServiceAddon.category.isnot(None)).all()
    return [cat[0] for cat in categories if cat[0]]


@router.get("/{addon_id}", response_model=ServiceAddonResponse)
def get_service_addon(addon_id: int, db: Session = Depends(get_db)):
    """Get a specific service add-on by ID"""
    addon = db.query(ServiceAddon).filter(ServiceAddon.id == addon_id).first()
    if not addon:
        raise HTTPException(status_code=404, detail="Service add-on not found")
    return addon


@router.put("/{addon_id}", response_model=ServiceAddonResponse)
def update_service_addon(addon_id: int, addon_update: ServiceAddonUpdate, db: Session = Depends(get_db)):
    """Update a service add-on"""
    db_addon = db.query(ServiceAddon).filter(ServiceAddon.id == addon_id).first()
    if not db_addon:
        raise HTTPException(status_code=404, detail="Service add-on not found")

    update_data = addon_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_addon, field, value)

    db.commit()
    db.refresh(db_addon)
    return db_addon


@router.delete("/{addon_id}")
def delete_service_addon(addon_id: int, db: Session = Depends(get_db)):
    """Delete a service add-on"""
    db_addon = db.query(ServiceAddon).filter(ServiceAddon.id == addon_id).first()
    if not db_addon:
        raise HTTPException(status_code=404, detail="Service add-on not found")

    db.delete(db_addon)
    db.commit()
    return {"message": "Service add-on deleted successfully"}
