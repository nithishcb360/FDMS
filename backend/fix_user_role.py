import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

# Create engine
engine = create_engine(settings.DATABASE_URL)

# Get users role and update admin12
with engine.connect() as conn:
    # First, find the "users" role
    result = conn.execute(text("SELECT id, name FROM roles WHERE name = 'users';"))
    users_role = result.fetchone()

    if users_role:
        users_role_id = users_role[0]
        print(f"Found 'users' role with ID: {users_role_id}")

        # Update admin12 user's role_id
        conn.execute(
            text("UPDATE users SET role_id = :role_id WHERE email = 'admin12@demo.com';"),
            {"role_id": users_role_id}
        )
        conn.commit()

        # Verify the update
        result = conn.execute(
            text("SELECT id, email, role_id, is_superuser FROM users WHERE email = 'admin12@demo.com';")
        )
        user = result.fetchone()
        if user:
            print(f"\nUpdated user:")
            print(f"  Email: {user[1]}")
            print(f"  Role ID: {user[2]}")
            print(f"  Is Superuser: {user[3]}")

        # Show all users
        print("\nAll users:")
        result = conn.execute(text("SELECT id, email, role_id, is_superuser FROM users;"))
        for row in result:
            print(f"  {row[1]}: role_id={row[2]}, is_superuser={row[3]}")
    else:
        print("ERROR: 'users' role not found!")

        # Show all roles
        print("\nAvailable roles:")
        result = conn.execute(text("SELECT id, name FROM roles;"))
        for row in result:
            print(f"  {row[0]}: {row[1]}")
