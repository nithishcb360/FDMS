"""
Script to remove old roles and ensure only 'users' role exists
"""
import sys
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.role import Role
from app.models.tab_setting import TabSetting  # Import to avoid relationship issues

def cleanup_roles():
    db = SessionLocal()
    try:
        # Get all existing roles
        roles = db.query(Role).all()

        print("Current roles in database:")
        for role in roles:
            print(f"  - ID: {role.id}, Name: {role.name}, Display: {role.display_name}")

        # Roles to remove
        roles_to_remove = ['superadmin', 'admin', 'administrator', 'manager', 'staff', 'viewer']

        # Delete old roles
        deleted_count = 0
        for role_name in roles_to_remove:
            role = db.query(Role).filter(Role.name == role_name).first()
            if role:
                print(f"\nDeleting role: {role.name} ({role.display_name})")
                db.delete(role)
                deleted_count += 1

        # Check if 'users' role exists
        users_role = db.query(Role).filter(Role.name == 'users').first()

        if not users_role:
            print("\nCreating 'users' role...")
            users_role = Role(
                name='users',
                display_name='Users',
                description='Standard user access',
                is_active=True
            )
            db.add(users_role)
            print("'users' role created")
        else:
            print(f"\n'users' role already exists (ID: {users_role.id})")

        db.commit()
        print(f"\nCleanup complete! Deleted {deleted_count} old roles.")

        # Show final state
        print("\nFinal roles in database:")
        final_roles = db.query(Role).all()
        for role in final_roles:
            print(f"  - ID: {role.id}, Name: {role.name}, Display: {role.display_name}")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    cleanup_roles()
