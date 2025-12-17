from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.branch import Branch
from ..schemas.branch import BranchCreate, BranchUpdate, BranchResponse

router = APIRouter()


@router.get("/", response_model=List[BranchResponse])
def get_branches(db: Session = Depends(get_db)):
    """Get all branches"""
    branches = db.query(Branch).all()
    return branches


@router.get("/{branch_id}", response_model=BranchResponse)
def get_branch(branch_id: int, db: Session = Depends(get_db)):
    """Get a branch by ID"""
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return branch


@router.post("/", response_model=BranchResponse)
def create_branch(branch: BranchCreate, db: Session = Depends(get_db)):
    """Create a new branch"""
    # Check if branch_code already exists
    existing = db.query(Branch).filter(Branch.branch_code == branch.branch_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Branch code already exists")

    db_branch = Branch(**branch.model_dump())
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    return db_branch


@router.put("/{branch_id}", response_model=BranchResponse)
def update_branch(branch_id: int, branch: BranchUpdate, db: Session = Depends(get_db)):
    """Update a branch"""
    db_branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not db_branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    # Check if updating branch_code to an existing one
    if branch.branch_code and branch.branch_code != db_branch.branch_code:
        existing = db.query(Branch).filter(Branch.branch_code == branch.branch_code).first()
        if existing:
            raise HTTPException(status_code=400, detail="Branch code already exists")

    # Update fields
    update_data = branch.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_branch, field, value)

    db.commit()
    db.refresh(db_branch)
    return db_branch


@router.delete("/{branch_id}")
def delete_branch(branch_id: int, db: Session = Depends(get_db)):
    """Delete a branch"""
    db_branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not db_branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    db.delete(db_branch)
    db.commit()
    return {"message": "Branch deleted successfully"}
