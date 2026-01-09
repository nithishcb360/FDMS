from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse

router = APIRouter()

@router.get("/stats")
def get_expense_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Expense)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Expense.user_id == current_user.id)

    total_expenses = query.count()
    total_amount = query.with_entities(func.sum(Expense.amount)).scalar() or 0.0
    pending = query.filter(Expense.status == "Pending").count()
    paid = query.filter(Expense.status == "Paid").count()

    return {
        "total_expenses": total_expenses,
        "total_amount": round(total_amount, 2),
        "pending": pending,
        "paid": round(paid, 2)
    }

@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(
    search: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Expense)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Expense.user_id == current_user.id)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Expense.expense_number.ilike(search_filter)) |
            (Expense.vendor_name.ilike(search_filter)) |
            (Expense.description.ilike(search_filter))
        )

    if status:
        query = query.filter(Expense.status == status)

    if category:
        query = query.filter(Expense.category == category)

    return query.order_by(Expense.created_at.desc()).all()

@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Expense).filter(Expense.id == expense_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Expense.user_id == current_user.id)

    expense = query.first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Auto-generate expense number
    latest_expense = db.query(Expense).order_by(Expense.id.desc()).first()
    if latest_expense and latest_expense.expense_number:
        try:
            last_num = int(latest_expense.expense_number.split('-')[-1])
            expense_number = f"EXP-{str(last_num + 1).zfill(3)}"
        except:
            expense_number = f"EXP-{str(db.query(Expense).count() + 1).zfill(3)}"
    else:
        expense_number = "EXP-001"

    expense_data = expense.model_dump()
    expense_data['expense_number'] = expense_number

    db_expense = Expense(**expense_data, user_id=current_user.id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, expense: ExpenseUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Expense).filter(Expense.id == expense_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Expense.user_id == current_user.id)

    db_expense = query.first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    update_data = expense.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_expense, field, value)

    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Expense).filter(Expense.id == expense_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Expense.user_id == current_user.id)

    db_expense = query.first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(db_expense)
    db.commit()
    return {"message": "Expense deleted successfully"}
