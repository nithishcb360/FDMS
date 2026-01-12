"""
Migration script to add role_id column to users table
"""
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'fdms.db')

print(f"Migrating database: {db_path}")
print("-" * 50)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check if role_id column exists
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]

    if 'role_id' not in columns:
        print("Adding role_id column to users table...")
        cursor.execute("ALTER TABLE users ADD COLUMN role_id INTEGER")
        conn.commit()
        print("SUCCESS: Added role_id column to users table")
    else:
        print("INFO: role_id column already exists in users table")

    # Verify
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("\nCurrent users table schema:")
    for col in columns:
        print(f"  {col[1]} ({col[2]})")

    conn.close()
    print("\nMigration completed successfully!")

except Exception as e:
    print(f"ERROR: {e}")
