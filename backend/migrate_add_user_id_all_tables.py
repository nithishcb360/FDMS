"""
Migration script to add user_id column to all user-specific tables
"""
import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.core.database import engine, SessionLocal


# Tables that should have user_id for data isolation
TABLES_TO_MIGRATE = [
    'cases',
    'tasks',
    'arrangements',
    'assignments',
    'case_notes',
    'communications',
    'contacts',
    'expenses',
    'families',
    'followups',
    'fuel_logs',
    'invoices',
    'next_of_kin',
    'payments',
    'preneeds',
    'purchase_orders',
    'schedules',
    'stock_movements',
    'transactions',
    'time_logs',
    'venue_bookings',
    'vehicle_assignments',
]


def migrate():
    """Add user_id column to all user-specific tables"""
    db = SessionLocal()

    try:
        print("Starting migration to add user_id to all tables...")
        print(f"Tables to migrate: {len(TABLES_TO_MIGRATE)}\n")

        updated_count = 0
        skipped_count = 0

        for table_name in TABLES_TO_MIGRATE:
            # Check if table exists
            result = db.execute(text(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'"))
            if not result.fetchone():
                print(f"SKIP: Table '{table_name}' does not exist")
                skipped_count += 1
                continue

            # Check if user_id column exists
            result = db.execute(text(f"PRAGMA table_info({table_name})"))
            columns = [row[1] for row in result.fetchall()]

            if 'user_id' not in columns:
                print(f"Adding user_id to '{table_name}'...")
                db.execute(text(f"""
                    ALTER TABLE {table_name}
                    ADD COLUMN user_id INTEGER
                """))

                # Create index on user_id
                db.execute(text(f"""
                    CREATE INDEX IF NOT EXISTS ix_{table_name}_user_id ON {table_name}(user_id)
                """))

                db.commit()
                print(f"OK Added user_id to '{table_name}'")
                updated_count += 1
            else:
                print(f"OK user_id already exists in '{table_name}'")
                skipped_count += 1

        print(f"\nMigration completed!")
        print(f"Tables updated: {updated_count}")
        print(f"Tables skipped: {skipped_count}")

    except Exception as e:
        print(f"Error during migration: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    migrate()
