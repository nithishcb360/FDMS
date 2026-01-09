"""
Migration script to add user_id column to cases and tasks tables
"""
import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.core.database import engine, SessionLocal


def migrate():
    """Add user_id column to cases and tasks tables"""
    db = SessionLocal()

    try:
        print("Starting migration...")

        # Check if user_id column exists in cases table (SQLite)
        result = db.execute(text("PRAGMA table_info(cases)"))
        columns = [row[1] for row in result.fetchall()]

        if 'user_id' not in columns:
            print("Adding user_id column to cases table...")
            db.execute(text("""
                ALTER TABLE cases
                ADD COLUMN user_id INTEGER
            """))

            # Create index on user_id
            db.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_cases_user_id ON cases(user_id)
            """))

            db.commit()
            print("OK Added user_id column to cases table")
        else:
            print("OK user_id column already exists in cases table")

        # Check if user_id column exists in tasks table (SQLite)
        result = db.execute(text("PRAGMA table_info(tasks)"))
        columns = [row[1] for row in result.fetchall()]

        if 'user_id' not in columns:
            print("Adding user_id column to tasks table...")
            db.execute(text("""
                ALTER TABLE tasks
                ADD COLUMN user_id INTEGER
            """))

            # Create index on user_id
            db.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_tasks_user_id ON tasks(user_id)
            """))

            db.commit()
            print("OK Added user_id column to tasks table")
        else:
            print("OK user_id column already exists in tasks table")

        print("\nMigration completed successfully!")

    except Exception as e:
        print(f"Error during migration: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    migrate()
