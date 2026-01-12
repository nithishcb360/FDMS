from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.tab_setting import TabSetting
from ..schemas.tab_setting import TabSettingCreate, TabSettingUpdate, TabSettingResponse

router = APIRouter()


@router.get("/", response_model=List[TabSettingResponse])
def get_all_tabs(db: Session = Depends(get_db)):
    """Get all tab settings ordered by sort_order"""
    tabs = db.query(TabSetting).order_by(TabSetting.sort_order).all()
    return tabs


@router.get("/{tab_id}", response_model=TabSettingResponse)
def get_tab(tab_id: int, db: Session = Depends(get_db)):
    """Get a specific tab setting by ID"""
    tab = db.query(TabSetting).filter(TabSetting.id == tab_id).first()
    if not tab:
        raise HTTPException(status_code=404, detail="Tab not found")
    return tab


@router.post("/", response_model=TabSettingResponse)
def create_tab(tab: TabSettingCreate, db: Session = Depends(get_db)):
    """Create a new tab setting"""
    # Check if tab with same name already exists
    existing_tab = db.query(TabSetting).filter(TabSetting.name == tab.name).first()
    if existing_tab:
        raise HTTPException(status_code=400, detail="Tab with this name already exists")

    db_tab = TabSetting(**tab.dict())
    db.add(db_tab)
    db.commit()
    db.refresh(db_tab)
    return db_tab


@router.put("/{tab_id}", response_model=TabSettingResponse)
def update_tab(tab_id: int, tab: TabSettingUpdate, db: Session = Depends(get_db)):
    """Update a tab setting"""
    db_tab = db.query(TabSetting).filter(TabSetting.id == tab_id).first()
    if not db_tab:
        raise HTTPException(status_code=404, detail="Tab not found")

    update_data = tab.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_tab, field, value)

    db.commit()
    db.refresh(db_tab)
    return db_tab


@router.patch("/{tab_id}/toggle", response_model=TabSettingResponse)
def toggle_tab(tab_id: int, db: Session = Depends(get_db)):
    """Toggle tab enabled/disabled status"""
    db_tab = db.query(TabSetting).filter(TabSetting.id == tab_id).first()
    if not db_tab:
        raise HTTPException(status_code=404, detail="Tab not found")

    db_tab.is_enabled = not db_tab.is_enabled
    db.commit()
    db.refresh(db_tab)
    return db_tab


@router.delete("/{tab_id}")
def delete_tab(tab_id: int, db: Session = Depends(get_db)):
    """Delete a tab setting"""
    db_tab = db.query(TabSetting).filter(TabSetting.id == tab_id).first()
    if not db_tab:
        raise HTTPException(status_code=404, detail="Tab not found")

    db.delete(db_tab)
    db.commit()
    return {"message": "Tab deleted successfully"}
