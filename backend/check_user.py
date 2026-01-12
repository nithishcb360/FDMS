"""
Script to check user details and assign Users role if needed
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.role import Role
from app.models.tab_setting import TabSetting

def check_and_fix_user(email: str):
    db = SessionLocal()
    try:
        # Get user
        user = db.query(User).filter(User.email == email).first()

        if not user:
            print(f"User {email} not found!")
            return

        print(f"User Details:")
        print(f"  Email: {user.email}")
        print(f"  Full Name: {user.full_name}")
        print(f"  Role ID: {user.role_id}")
        print(f"  Is Superuser: {user.is_superuser}")
        print(f"  Is Active: {user.is_active}")

        # Get Users role
        users_role = db.query(Role).filter(Role.name == 'users').first()

        if not users_role:
            print("\nError: 'users' role not found!")
            return

        print(f"\n'Users' Role:")
        print(f"  ID: {users_role.id}")
        print(f"  Name: {users_role.name}")
        print(f"  Display Name: {users_role.display_name}")
        print(f"  Tabs Assigned: {len(users_role.tabs)}")

        # Check if user needs role assignment
        if user.role_id is None or user.role_id != users_role.id:
            print(f"\nUser needs role assignment!")
            print(f"  Current role_id: {user.role_id}")
            print(f"  Should be: {users_role.id}")

            # Assign role
            user.role_id = users_role.id
            db.commit()
            print(f"\n✓ User role updated to 'users' (ID: {users_role.id})")
        else:
            print(f"\n✓ User already has correct role assigned")

        # Show some sample tabs
        print(f"\nSample tabs this user should see:")
        for tab in users_role.tabs[:10]:
            print(f"  - {tab.label} ({tab.name})")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "admin12@demo.com"
    check_and_fix_user(email)
