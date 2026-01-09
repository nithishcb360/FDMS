from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from ..models.transaction import Transaction
from ..models.user import User
from ..schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse
from ..core.database import get_db
from ..core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Auto-generate transaction ID
    latest_transaction = db.query(Transaction).order_by(Transaction.id.desc()).first()
    if latest_transaction and latest_transaction.transaction_id:
        try:
            last_num = int(latest_transaction.transaction_id.split('-')[-1])
            transaction_id = f"TXN-{str(last_num + 1).zfill(3)}"
        except:
            transaction_id = f"TXN-{str(db.query(Transaction).count() + 1).zfill(3)}"
    else:
        transaction_id = "TXN-001"

    transaction_data = transaction.model_dump()
    transaction_data['transaction_id'] = transaction_id

    db_transaction = Transaction(**transaction_data, user_id=current_user.id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/", response_model=List[TransactionResponse])
def get_transactions(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    transaction_type: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Transaction.user_id == current_user.id)

    if search:
        query = query.filter(
            (Transaction.transaction_id.contains(search)) |
            (Transaction.description.contains(search)) |
            (Transaction.account_name.contains(search))
        )

    if transaction_type:
        query = query.filter(Transaction.transaction_type == transaction_type)

    if category:
        query = query.filter(Transaction.category == category)

    transactions = query.order_by(Transaction.transaction_date.desc()).offset(skip).limit(limit).all()
    return transactions

@router.get("/stats")
def get_transaction_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Transaction)

    # If not superadmin, filter by user_id
    if not current_user.is_superuser:
        query = query.filter(Transaction.user_id == current_user.id)

    total_transactions = query.count()

    income = query.filter(
        Transaction.transaction_type == "Income"
    ).with_entities(func.sum(Transaction.amount)).scalar() or 0.0

    expenses = query.filter(
        Transaction.transaction_type == "Expense"
    ).with_entities(func.sum(Transaction.amount)).scalar() or 0.0

    net = income - expenses

    return {
        "total_transactions": total_transactions,
        "income": income,
        "expenses": expenses,
        "net": net
    }

@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Transaction).filter(Transaction.id == transaction_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Transaction.user_id == current_user.id)

    transaction = query.first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(Transaction.id == transaction_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Transaction.user_id == current_user.id)

    db_transaction = query.first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    update_data = transaction.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_transaction, key, value)

    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Transaction).filter(Transaction.id == transaction_id)

    # If not superadmin, ensure item belongs to user
    if not current_user.is_superuser:
        query = query.filter(Transaction.user_id == current_user.id)

    db_transaction = query.first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}
