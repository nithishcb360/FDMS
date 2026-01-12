"""
User management script for FDMS
Allows creating superusers and managing user accounts
"""
import sys
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_superuser(email: str, password: str, full_name: str = None):
    """Create a new superuser account"""
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"User with email {email} already exists!")
            return

        # Create new superuser
        hashed_password = get_password_hash(password)
        new_user = User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name or "Administrator",
            is_active=True,
            is_superuser=True,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        print(f"Successfully created superuser!")
        print(f"  - Email: {new_user.email}")
        print(f"  - Full Name: {new_user.full_name}")
        print(f"  - Is Superuser: {new_user.is_superuser}")

    except Exception as e:
        print(f"Error creating superuser: {e}")
        db.rollback()
    finally:
        db.close()

def make_superuser(email: str):
    """Promote an existing user to superuser"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()

        if not user:
            print(f"User with email {email} not found!")
            return

        user.is_superuser = True
        db.commit()
        db.refresh(user)

        print(f"Successfully promoted user to Super Admin!")
        print(f"  - Email: {user.email}")
        print(f"  - Full Name: {user.full_name}")
        print(f"  - Is Superuser: {user.is_superuser}")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

def list_users():
    """List all users in the system"""
    db = SessionLocal()
    try:
        users = db.query(User).all()

        if not users:
            print("No users found in the system.")
            return

        print(f"\nFound {len(users)} user(s):\n")
        print(f"{'ID':<5} {'Email':<30} {'Full Name':<25} {'Superuser':<10} {'Active':<8}")
        print("-" * 90)

        for user in users:
            print(
                f"{user.id:<5} {user.email:<30} {user.full_name or 'N/A':<25} "
                f"{'Yes' if user.is_superuser else 'No':<10} {'Yes' if user.is_active else 'No':<8}"
            )

    except Exception as e:
        print(f"Error listing users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python manage_users.py list                           - List all users")
        print("  python manage_users.py promote <email>                - Promote user to superuser")
        print("  python manage_users.py create <email> <password> [name] - Create new superuser")
        sys.exit(1)

    command = sys.argv[1]

    if command == "list":
        list_users()
    elif command == "promote":
        if len(sys.argv) < 3:
            print("Error: Email required")
            print("Usage: python manage_users.py promote <email>")
            sys.exit(1)
        make_superuser(sys.argv[2])
    elif command == "create":
        if len(sys.argv) < 4:
            print("Error: Email and password required")
            print("Usage: python manage_users.py create <email> <password> [full_name]")
            sys.exit(1)
        email = sys.argv[2]
        password = sys.argv[3]
        full_name = sys.argv[4] if len(sys.argv) > 4 else None
        create_superuser(email, password, full_name)
    else:
        print(f"Unknown command: {command}")
        print("Available commands: list, promote, create")
        sys.exit(1)
