from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..models.purchase_order import PurchaseOrder
from ..schemas.purchase_order import PurchaseOrderCreate, PurchaseOrderUpdate, PurchaseOrderResponse

router = APIRouter()


@router.get("/", response_model=List[PurchaseOrderResponse])
def get_purchase_orders(db: Session = Depends(get_db)):
    """Get all purchase orders"""
    orders = db.query(PurchaseOrder).all()
    return orders


@router.get("/{order_id}", response_model=PurchaseOrderResponse)
def get_purchase_order(order_id: int, db: Session = Depends(get_db)):
    """Get a purchase order by ID"""
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return order


@router.post("/", response_model=PurchaseOrderResponse)
def create_purchase_order(order: PurchaseOrderCreate, db: Session = Depends(get_db)):
    """Create a new purchase order"""
    # Auto-generate PO number if not provided
    order_data = order.model_dump()
    if not order_data.get('po_number'):
        # Generate PO number (e.g., "PO-2025-0001")
        order_count = db.query(PurchaseOrder).count()
        order_data['po_number'] = f"PO-2025-{str(order_count + 1).zfill(4)}"

    # Check if po_number already exists
    existing = db.query(PurchaseOrder).filter(PurchaseOrder.po_number == order_data['po_number']).first()
    if existing:
        raise HTTPException(status_code=400, detail="PO number already exists")

    # Calculate total amount from order items if not provided
    if order_data.get('order_items') and not order_data.get('total_amount'):
        subtotal = sum(
            item.get('quantity', 0) * item.get('unit_price', 0)
            for item in order_data['order_items']
        )
        order_data['total_amount'] = subtotal + order_data.get('tax_amount', 0) + order_data.get('shipping_cost', 0)

    db_order = PurchaseOrder(**order_data)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


@router.put("/{order_id}", response_model=PurchaseOrderResponse)
def update_purchase_order(order_id: int, order: PurchaseOrderUpdate, db: Session = Depends(get_db)):
    """Update a purchase order"""
    db_order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    # Check if updating po_number to an existing one
    if order.po_number and order.po_number != db_order.po_number:
        existing = db.query(PurchaseOrder).filter(PurchaseOrder.po_number == order.po_number).first()
        if existing:
            raise HTTPException(status_code=400, detail="PO number already exists")

    # Update fields
    update_data = order.model_dump(exclude_unset=True)

    # Recalculate total if order items changed
    if 'order_items' in update_data:
        subtotal = sum(
            item.get('quantity', 0) * item.get('unit_price', 0)
            for item in update_data['order_items']
        )
        tax = update_data.get('tax_amount', db_order.tax_amount)
        shipping = update_data.get('shipping_cost', db_order.shipping_cost)
        update_data['total_amount'] = subtotal + tax + shipping

    for field, value in update_data.items():
        setattr(db_order, field, value)

    db.commit()
    db.refresh(db_order)
    return db_order


@router.delete("/{order_id}")
def delete_purchase_order(order_id: int, db: Session = Depends(get_db)):
    """Delete a purchase order"""
    db_order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    db.delete(db_order)
    db.commit()
    return {"message": "Purchase order deleted successfully"}
