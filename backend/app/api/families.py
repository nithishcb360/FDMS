from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from ..models.family import Family
from ..schemas.family import FamilyCreate, FamilyUpdate, FamilyResponse
from ..core.database import get_db

router = APIRouter()

@router.post("/", response_model=FamilyResponse)
def create_family(family: FamilyCreate, db: Session = Depends(get_db)):
    # Auto-generate family ID
    latest_family = db.query(Family).order_by(Family.id.desc()).first()
    if latest_family and latest_family.family_id:
        try:
            last_num = int(latest_family.family_id.split('-')[-1])
            family_id = f"FAM-{str(last_num + 1).zfill(3)}"
        except:
            family_id = f"FAM-{str(db.query(Family).count() + 1).zfill(3)}"
    else:
        family_id = "FAM-001"

    family_data = family.model_dump()
    family_data['family_id'] = family_id
    family_data['total_cases'] = 0
    family_data['lifetime_value'] = 0.0
    family_data['status'] = "Active"

    db_family = Family(**family_data)
    db.add(db_family)
    db.commit()
    db.refresh(db_family)
    return db_family

@router.get("/", response_model=List[FamilyResponse])
def get_families(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Family)

    if search:
        query = query.filter(
            (Family.primary_contact_name.contains(search)) |
            (Family.email.contains(search)) |
            (Family.phone.contains(search)) |
            (Family.family_id.contains(search))
        )

    if status:
        query = query.filter(Family.status == status)

    families = query.order_by(Family.created_at.desc()).offset(skip).limit(limit).all()
    return families

@router.get("/stats")
def get_family_stats(db: Session = Depends(get_db)):
    total_families = db.query(func.count(Family.id)).scalar()

    active_families = db.query(func.count(Family.id)).filter(
        Family.status == "Active"
    ).scalar()

    total_revenue = db.query(func.sum(Family.lifetime_value)).scalar() or 0.0

    avg_lifetime_value = db.query(func.avg(Family.lifetime_value)).scalar() or 0.0

    return {
        "total_families": total_families,
        "active_families": active_families,
        "total_revenue": total_revenue,
        "avg_lifetime_value": avg_lifetime_value
    }

@router.get("/{family_id}", response_model=FamilyResponse)
def get_family(family_id: int, db: Session = Depends(get_db)):
    family = db.query(Family).filter(Family.id == family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    return family

@router.put("/{family_id}", response_model=FamilyResponse)
def update_family(
    family_id: int,
    family: FamilyUpdate,
    db: Session = Depends(get_db)
):
    db_family = db.query(Family).filter(Family.id == family_id).first()
    if not db_family:
        raise HTTPException(status_code=404, detail="Family not found")

    update_data = family.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_family, key, value)

    db.commit()
    db.refresh(db_family)
    return db_family

@router.delete("/{family_id}")
def delete_family(family_id: int, db: Session = Depends(get_db)):
    db_family = db.query(Family).filter(Family.id == family_id).first()
    if not db_family:
        raise HTTPException(status_code=404, detail="Family not found")

    db.delete(db_family)
    db.commit()
    return {"message": "Family deleted successfully"}
