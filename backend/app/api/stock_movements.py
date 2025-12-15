from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.stock_movement import StockMovement
from app.schemas.stock_movement import StockMovementCreate, StockMovementUpdate, StockMovementResponse

router = APIRouter()

@router.get("/", response_model=List[StockMovementResponse])
def get_stock_movements(db: Session = Depends(get_db)):
    movements = db.query(StockMovement).order_by(StockMovement.movement_date.desc()).all()
    return movements

@router.get("/{movement_id}", response_model=StockMovementResponse)
def get_stock_movement(movement_id: int, db: Session = Depends(get_db)):
    movement = db.query(StockMovement).filter(StockMovement.id == movement_id).first()
    if not movement:
        raise HTTPException(status_code=404, detail="Stock movement not found")
    return movement

@router.post("/", response_model=StockMovementResponse)
def create_stock_movement(movement: StockMovementCreate, db: Session = Depends(get_db)):
    # Generate movement_id
    movement_count = db.query(StockMovement).count()
    movement_id = f"MOV-2025-{str(movement_count + 1).zfill(4)}"

    # Create movement data
    movement_data = movement.model_dump()
    movement_data['movement_id'] = movement_id

    db_movement = StockMovement(**movement_data)
    db.add(db_movement)
    db.commit()
    db.refresh(db_movement)
    return db_movement

@router.put("/{movement_id}", response_model=StockMovementResponse)
def update_stock_movement(movement_id: int, movement: StockMovementUpdate, db: Session = Depends(get_db)):
    db_movement = db.query(StockMovement).filter(StockMovement.id == movement_id).first()
    if not db_movement:
        raise HTTPException(status_code=404, detail="Stock movement not found")

    for key, value in movement.model_dump(exclude_unset=True).items():
        setattr(db_movement, key, value)

    db.commit()
    db.refresh(db_movement)
    return db_movement

@router.delete("/{movement_id}")
def delete_stock_movement(movement_id: int, db: Session = Depends(get_db)):
    db_movement = db.query(StockMovement).filter(StockMovement.id == movement_id).first()
    if not db_movement:
        raise HTTPException(status_code=404, detail="Stock movement not found")

    db.delete(db_movement)
    db.commit()
    return {"message": "Stock movement deleted successfully"}
