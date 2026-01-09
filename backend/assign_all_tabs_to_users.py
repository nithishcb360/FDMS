"""
Script to assign all tabs to the 'users' role
"""
import sys
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.role import Role
from app.models.tab_setting import TabSetting

def assign_all_tabs_to_users():
    db = SessionLocal()
    try:
        # Get the users role
        users_role = db.query(Role).filter(Role.name == 'users').first()

        if not users_role:
            print("Error: 'users' role not found!")
            return

        print(f"Found 'users' role (ID: {users_role.id})")

        # Get all tabs
        all_tabs = db.query(TabSetting).all()
        print(f"Found {len(all_tabs)} tabs in the database")

        # Assign all tabs to the users role
        users_role.tabs = all_tabs
        db.commit()

        print(f"\nSuccessfully assigned {len(all_tabs)} tabs to 'users' role!")

        # Verify
        db.refresh(users_role)
        print(f"Verification: 'users' role now has {len(users_role.tabs)} tabs assigned")

        # Show some examples
        print("\nSample tabs assigned:")
        for tab in users_role.tabs[:10]:
            print(f"  - {tab.label} ({tab.name})")
        if len(users_role.tabs) > 10:
            print(f"  ... and {len(users_role.tabs) - 10} more")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    assign_all_tabs_to_users()
