"""
Script to assign superadmin role to the superadmin user
"""
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.core.config import settings

# Import all models to ensure relationships are properly initialized
from app.models.user import User
from app.models.role import Role
from app.models.tab_setting import TabSetting

# Create database tables if they don't exist
from app.core.database import Base
Base.metadata.create_all(bind=engine)

print(f"Using database: {settings.DATABASE_URL}")
print("-" * 50)


def assign_superadmin_role():
    """
    Create superadmin role and assign it to the superadmin user
    """
    db: Session = SessionLocal()

    try:
        # Create or get superadmin role
        superadmin_role = db.query(Role).filter(Role.name == 'superadmin').first()

        if not superadmin_role:
            print("Creating superadmin role...")
            superadmin_role = Role(
                name='superadmin',
                display_name='Super Administrator',
                description='Full system access with all permissions',
                is_active=True
            )
            db.add(superadmin_role)
            db.commit()
            db.refresh(superadmin_role)
            print(f"Created superadmin role with ID: {superadmin_role.id}")
        else:
            print(f"Superadmin role already exists with ID: {superadmin_role.id}")

        # Get the superadmin user
        superadmin_user = db.query(User).filter(User.email == 'admin@fdms.com').first()

        if not superadmin_user:
            print("ERROR: Superadmin user not found!")
            print("Please run create_superadmin.py first")
            return

        # Assign role to user
        if superadmin_user.role_id != superadmin_role.id:
            superadmin_user.role_id = superadmin_role.id
            db.commit()
            db.refresh(superadmin_user)
            print(f"SUCCESS: Assigned superadmin role to user: {superadmin_user.email}")
        else:
            print(f"User {superadmin_user.email} already has superadmin role")

        print("\nUser Details:")
        print(f"  Email: {superadmin_user.email}")
        print(f"  Full Name: {superadmin_user.full_name}")
        print(f"  Role ID: {superadmin_user.role_id}")
        print(f"  Is Superuser: {superadmin_user.is_superuser}")
        print(f"  Is Active: {superadmin_user.is_active}")

    except Exception as e:
        print(f"ERROR: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    assign_superadmin_role()
