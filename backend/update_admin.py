"""
Script to update a user to be a superuser
"""
from app.core.database import SessionLocal
from app.models.user import User

def make_user_superadmin(email: str):
    db = SessionLocal()
    try:
        # Find user by email
        user = db.query(User).filter(User.email == email).first()

        if not user:
            print(f"User with email {email} not found!")
            return

        # Update user to be superuser
        user.is_superuser = True
        user.full_name = "System Administrator"

        db.commit()
        db.refresh(user)

        print(f"Successfully updated user {user.email} to Super Admin!")
        print(f"  - Full Name: {user.full_name}")
        print(f"  - Email: {user.email}")
        print(f"  - Is Superuser: {user.is_superuser}")
        print(f"  - Is Active: {user.is_active}")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Update the admin user
    admin_email = "admin@funeral.com"
    make_user_superadmin(admin_email)
