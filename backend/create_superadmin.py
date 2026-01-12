"""
Script to create a superadmin user for the FDMS system
"""
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User
from app.core.security import get_password_hash
from app.core.config import settings

# Create database tables if they don't exist
from app.core.database import Base
Base.metadata.create_all(bind=engine)

print(f"Using database: {settings.DATABASE_URL}")
print("-" * 50)


def create_superadmin():
    """
    Create a superadmin user with predefined credentials
    """
    db: Session = SessionLocal()

    try:
        # Superadmin credentials
        email = "admin@fdms.com"
        password = "Admin@123"
        full_name = "Super Administrator"

        # Check if superadmin already exists
        existing_user = db.query(User).filter(User.email == email).first()

        if existing_user:
            print(f"WARNING: Superadmin user already exists with email: {email}")
            print(f"   User ID: {existing_user.id}")
            print(f"   Full Name: {existing_user.full_name}")
            print(f"   Is Superuser: {existing_user.is_superuser}")
            print(f"   Is Active: {existing_user.is_active}")
            return

        # Create superadmin user
        hashed_password = get_password_hash(password)
        superadmin = User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            is_active=True,
            is_superuser=True,
        )

        db.add(superadmin)
        db.commit()
        db.refresh(superadmin)

        print("SUCCESS: Superadmin user created successfully!")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Full Name: {full_name}")
        print(f"   User ID: {superadmin.id}")
        print("\nIMPORTANT: Please change the password after first login!")

    except Exception as e:
        print(f"ERROR: Error creating superadmin user: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_superadmin()
