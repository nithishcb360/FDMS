"""
Script to create a test user with the Users role
"""
import sys
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.role import Role
from app.models.tab_setting import TabSetting  # Import to resolve relationship
from app.core.security import get_password_hash

def create_test_user():
    db = SessionLocal()
    try:
        # Get the Users role
        users_role = db.query(Role).filter(Role.name == 'users').first()

        if not users_role:
            print("Error: 'users' role not found!")
            print("Please run the initialization scripts first.")
            return

        print(f"Found 'users' role (ID: {users_role.id})")
        print(f"This role has {len(users_role.tabs)} tabs assigned")

        # Check if test user already exists
        test_email = "testuser@example.com"
        existing_user = db.query(User).filter(User.email == test_email).first()

        if existing_user:
            print(f"\nUser with email {test_email} already exists!")
            print(f"  - ID: {existing_user.id}")
            print(f"  - Full Name: {existing_user.full_name}")
            print(f"  - Role ID: {existing_user.role_id}")
            print(f"  - Is Superuser: {existing_user.is_superuser}")

            # Update the user's role if needed
            if existing_user.role_id != users_role.id:
                print(f"\nUpdating user's role from {existing_user.role_id} to {users_role.id}...")
                existing_user.role_id = users_role.id
                existing_user.is_superuser = False
                db.commit()
                print("User role updated!")
            else:
                print("\nUser already has the correct role assigned.")

            return

        # Create new test user
        print(f"\nCreating new user: {test_email}")

        test_user = User(
            email=test_email,
            full_name="Test User",
            hashed_password=get_password_hash("password123"),
            role_id=users_role.id,
            is_active=True,
            is_superuser=False
        )

        db.add(test_user)
        db.commit()
        db.refresh(test_user)

        print("\nTest user created successfully!")
        print(f"  - Email: {test_user.email}")
        print(f"  - Password: password123")
        print(f"  - Full Name: {test_user.full_name}")
        print(f"  - Role ID: {test_user.role_id}")
        print(f"  - Role Name: {users_role.name}")
        print(f"  - Assigned Tabs: {len(users_role.tabs)}")

        print("\n" + "="*50)
        print("LOGIN CREDENTIALS:")
        print("  Email: testuser@example.com")
        print("  Password: password123")
        print("="*50)

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
