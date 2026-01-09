import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

# Create engine
engine = create_engine(settings.DATABASE_URL)

with engine.connect() as conn:
    # First, find the "users" role
    result = conn.execute(text("SELECT id, name FROM roles WHERE name = 'users';"))
    users_role = result.fetchone()

    if not users_role:
        print("ERROR: 'users' role not found!")
        exit(1)

    users_role_id = users_role[0]
    print(f"Found 'users' role with ID: {users_role_id}")

    # Update ALL non-superuser users to have the correct role_id
    # Superusers can have NULL role_id, but regular users need a role
    conn.execute(
        text("UPDATE users SET role_id = :role_id WHERE is_superuser = 0 AND (role_id IS NULL OR role_id != :role_id);"),
        {"role_id": users_role_id}
    )

    # Also fix the admin@fdms.com user who has role_id=1 (which doesn't exist)
    # Since they're marked as superuser, we'll set them to NULL for consistency with other superusers
    conn.execute(
        text("UPDATE users SET role_id = NULL WHERE is_superuser = 1 AND role_id = 1;")
    )

    conn.commit()
    print("Updated all users' role_ids")

    # Show all users
    print("\nAll users after update:")
    result = conn.execute(text("SELECT id, email, role_id, is_superuser FROM users ORDER BY id;"))
    for row in result:
        role_display = f"role_id={row[2]}" if row[2] is not None else "role_id=NULL (superuser)"
        print(f"  {row[1]}: {role_display}, is_superuser={row[3]}")
