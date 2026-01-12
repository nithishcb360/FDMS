from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.role import Role
from ..models.tab_setting import TabSetting
from ..models.user import User
from ..schemas.role import RoleCreate, RoleUpdate, RoleResponse, RoleWithTabs, AssignTabsToRole
from ..schemas.tab_setting import TabSettingResponse

router = APIRouter()


@router.get("/", response_model=List[RoleResponse])
def get_all_roles(db: Session = Depends(get_db)):
    """Get all roles"""
    roles = db.query(Role).all()
    return roles


@router.get("/{role_id}", response_model=RoleWithTabs)
def get_role(role_id: int, db: Session = Depends(get_db)):
    """Get a specific role with its assigned tabs"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    # Get tab IDs
    tab_ids = [tab.id for tab in role.tabs]

    return {
        **role.__dict__,
        "tab_ids": tab_ids
    }


@router.post("/", response_model=RoleResponse)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    """Create a new role"""
    # Check if role with same name already exists
    existing_role = db.query(Role).filter(Role.name == role.name).first()
    if existing_role:
        raise HTTPException(status_code=400, detail="Role with this name already exists")

    db_role = Role(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role


@router.put("/{role_id}", response_model=RoleResponse)
def update_role(role_id: int, role: RoleUpdate, db: Session = Depends(get_db)):
    """Update a role"""
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")

    update_data = role.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_role, field, value)

    db.commit()
    db.refresh(db_role)
    return db_role


@router.post("/{role_id}/tabs", response_model=RoleWithTabs)
def assign_tabs_to_role(role_id: int, data: AssignTabsToRole, db: Session = Depends(get_db)):
    """Assign tabs to a role"""
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")

    # Get all tabs by IDs
    tabs = db.query(TabSetting).filter(TabSetting.id.in_(data.tab_ids)).all()

    # Clear existing tabs and assign new ones
    db_role.tabs = tabs
    db.commit()
    db.refresh(db_role)

    # Get tab IDs
    tab_ids = [tab.id for tab in db_role.tabs]

    return {
        **db_role.__dict__,
        "tab_ids": tab_ids
    }


@router.get("/{role_id}/tabs", response_model=List[TabSettingResponse])
def get_role_tabs(role_id: int, db: Session = Depends(get_db)):
    """Get all tabs assigned to a specific role"""
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")

    # Return the tabs associated with this role
    return db_role.tabs


@router.delete("/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    """Delete a role"""
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")

    db.delete(db_role)
    db.commit()
    return {"message": "Role deleted successfully"}
