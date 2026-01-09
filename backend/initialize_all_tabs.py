"""
Script to initialize all 61 tabs in the database
"""
import sys
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.tab_setting import TabSetting
from app.models.role import Role

def initialize_all_tabs():
    db = SessionLocal()
    try:
        # Clear existing tabs
        print("Clearing existing tabs...")
        db.query(TabSetting).delete()
        db.commit()

        default_tabs = [
            # Dashboard
            {'name': 'dashboard', 'label': 'Dashboard', 'path': '/dashboard', 'is_enabled': True, 'sort_order': 1},

            # Cases
            {'name': 'cases', 'label': 'Cases', 'is_enabled': True, 'sort_order': 2},
            {'name': 'cases_list', 'label': 'Cases List', 'path': '/cases', 'parent': 'cases', 'is_enabled': True, 'sort_order': 3},
            {'name': 'next_of_kin', 'label': 'Next of Kin', 'path': '/next-of-kin', 'parent': 'cases', 'is_enabled': True, 'sort_order': 4},
            {'name': 'notes', 'label': 'Notes', 'path': '/notes', 'parent': 'cases', 'is_enabled': True, 'sort_order': 5},
            {'name': 'assignments', 'label': 'Assignments', 'path': '/assignments', 'parent': 'cases', 'is_enabled': True, 'sort_order': 6},

            # Services
            {'name': 'services', 'label': 'Services', 'is_enabled': True, 'sort_order': 7},
            {'name': 'service_schedules', 'label': 'Service Schedules', 'path': '/services/schedules', 'parent': 'services', 'is_enabled': True, 'sort_order': 8},
            {'name': 'arrangements', 'label': 'Arrangements', 'path': '/services/arrangements', 'parent': 'services', 'is_enabled': True, 'sort_order': 9},
            {'name': 'venue_bookings', 'label': 'Venue Bookings', 'path': '/services/venue-bookings', 'parent': 'services', 'is_enabled': True, 'sort_order': 10},
            {'name': 'service_addons', 'label': 'Service Add-ons', 'path': '/services/add-ons', 'parent': 'services', 'is_enabled': True, 'sort_order': 11},

            # Operations
            {'name': 'operations', 'label': 'Operations', 'is_enabled': True, 'sort_order': 12},
            # Inventory (sub-section of Operations)
            {'name': 'inventory', 'label': 'Inventory', 'parent': 'operations', 'is_enabled': True, 'sort_order': 13},
            {'name': 'inventory_products', 'label': 'Products', 'path': '/inventory/products', 'parent': 'inventory', 'is_enabled': True, 'sort_order': 14},
            {'name': 'inventory_categories', 'label': 'Categories', 'path': '/inventory/categories', 'parent': 'inventory', 'is_enabled': True, 'sort_order': 15},
            {'name': 'inventory_suppliers', 'label': 'Suppliers', 'path': '/inventory/suppliers', 'parent': 'inventory', 'is_enabled': True, 'sort_order': 16},
            {'name': 'inventory_purchase_orders', 'label': 'Purchase Orders', 'path': '/inventory/purchase-orders', 'parent': 'inventory', 'is_enabled': True, 'sort_order': 17},
            {'name': 'inventory_stock_movements', 'label': 'Stock Movements', 'path': '/inventory/stock-movements', 'parent': 'inventory', 'is_enabled': True, 'sort_order': 18},
            # Fleet (sub-section of Operations)
            {'name': 'fleet', 'label': 'Fleet', 'parent': 'operations', 'is_enabled': True, 'sort_order': 19},
            {'name': 'fleet_vehicles', 'label': 'Vehicles', 'path': '/fleet/vehicles', 'parent': 'fleet', 'is_enabled': True, 'sort_order': 20},
            {'name': 'fleet_assignments', 'label': 'Fleet Assignments', 'path': '/fleet/assignments', 'parent': 'fleet', 'is_enabled': True, 'sort_order': 21},
            {'name': 'fleet_maintenance', 'label': 'Maintenance', 'path': '/fleet/maintenance', 'parent': 'fleet', 'is_enabled': True, 'sort_order': 22},
            {'name': 'fleet_fuel_logs', 'label': 'Fuel Logs', 'path': '/fleet/fuel-logs', 'parent': 'fleet', 'is_enabled': True, 'sort_order': 23},
            # Staff (sub-section of Operations)
            {'name': 'staff', 'label': 'Staff', 'parent': 'operations', 'is_enabled': True, 'sort_order': 24},
            {'name': 'staff_members', 'label': 'Staff Members', 'path': '/staff/members', 'parent': 'staff', 'is_enabled': True, 'sort_order': 25},
            {'name': 'staff_tasks', 'label': 'Tasks', 'path': '/staff/tasks', 'parent': 'staff', 'is_enabled': True, 'sort_order': 26},
            {'name': 'staff_schedules', 'label': 'Staff Schedules', 'path': '/staff/schedules', 'parent': 'staff', 'is_enabled': True, 'sort_order': 27},
            {'name': 'staff_time_logs', 'label': 'Time Logs', 'path': '/staff/time-logs', 'parent': 'staff', 'is_enabled': True, 'sort_order': 28},

            # Finance
            {'name': 'finance', 'label': 'Finance', 'is_enabled': True, 'sort_order': 29},
            {'name': 'invoices', 'label': 'Invoices', 'path': '/finance/invoices', 'parent': 'finance', 'is_enabled': True, 'sort_order': 30},
            {'name': 'payments', 'label': 'Payments', 'path': '/finance/payments', 'parent': 'finance', 'is_enabled': True, 'sort_order': 31},
            {'name': 'expenses', 'label': 'Expenses', 'path': '/finance/expenses', 'parent': 'finance', 'is_enabled': True, 'sort_order': 32},
            {'name': 'transactions', 'label': 'Transactions', 'path': '/finance/transactions', 'parent': 'finance', 'is_enabled': True, 'sort_order': 33},

            # CRM
            {'name': 'crm', 'label': 'CRM', 'is_enabled': True, 'sort_order': 34},
            {'name': 'crm_families', 'label': 'Families', 'path': '/crm/families', 'parent': 'crm', 'is_enabled': True, 'sort_order': 35},
            {'name': 'crm_communications', 'label': 'Communications', 'path': '/crm/communications', 'parent': 'crm', 'is_enabled': True, 'sort_order': 36},
            {'name': 'crm_followups', 'label': 'Follow-ups', 'path': '/crm/followups', 'parent': 'crm', 'is_enabled': True, 'sort_order': 37},
            {'name': 'crm_preneed', 'label': 'Pre-need Plans', 'path': '/crm/preneed', 'parent': 'crm', 'is_enabled': True, 'sort_order': 38},

            # Documents
            {'name': 'documents', 'label': 'Documents', 'is_enabled': True, 'sort_order': 39},
            {'name': 'all_documents', 'label': 'All Documents', 'path': '/all-documents', 'parent': 'documents', 'is_enabled': True, 'sort_order': 40},
            {'name': 'document_types', 'label': 'Document Types', 'path': '/document-types', 'parent': 'documents', 'is_enabled': True, 'sort_order': 41},
            {'name': 'templates', 'label': 'Templates', 'path': '/templates', 'parent': 'documents', 'is_enabled': True, 'sort_order': 42},

            # Reports & Analytics
            {'name': 'reports', 'label': 'Reports & Analytics', 'is_enabled': True, 'sort_order': 43},
            {'name': 'all_reports', 'label': 'All Reports', 'path': '/all-reports', 'parent': 'reports', 'is_enabled': True, 'sort_order': 44},
            {'name': 'report_schedules', 'label': 'Schedules', 'path': '/schedules', 'parent': 'reports', 'is_enabled': True, 'sort_order': 45},
            {'name': 'dashboards', 'label': 'Dashboards', 'path': '/dashboards', 'parent': 'reports', 'is_enabled': True, 'sort_order': 46},
            {'name': 'metrics_kpis', 'label': 'Metrics & KPIs', 'path': '/metrics-kpis', 'parent': 'reports', 'is_enabled': True, 'sort_order': 47},
            {'name': 'alerts', 'label': 'Alerts', 'path': '/alerts', 'parent': 'reports', 'is_enabled': True, 'sort_order': 48},

            # Settings
            {'name': 'settings', 'label': 'Settings', 'is_enabled': True, 'sort_order': 49},
            {'name': 'settings_branches', 'label': 'Branches', 'path': '/settings/branches', 'parent': 'settings', 'is_enabled': True, 'sort_order': 50},
            {'name': 'settings_service_types', 'label': 'Service Types', 'path': '/settings/service-types', 'parent': 'settings', 'is_enabled': True, 'sort_order': 51},
            {'name': 'settings_service_packages', 'label': 'Service Packages', 'path': '/settings/service-packages', 'parent': 'settings', 'is_enabled': True, 'sort_order': 52},
            {'name': 'settings_venue_types', 'label': 'Venue Types', 'path': '/settings/venue-types', 'parent': 'settings', 'is_enabled': True, 'sort_order': 53},
            {'name': 'settings_tax_codes', 'label': 'Tax Codes', 'path': '/settings/tax-codes', 'parent': 'settings', 'is_enabled': True, 'sort_order': 54},
            {'name': 'settings_payment_modes', 'label': 'Payment Modes', 'path': '/settings/payment-modes', 'parent': 'settings', 'is_enabled': True, 'sort_order': 55},
            {'name': 'settings_religious_rites', 'label': 'Religious Rites', 'path': '/settings/religious-rites', 'parent': 'settings', 'is_enabled': True, 'sort_order': 56},
            {'name': 'settings_document_types', 'label': 'Document Types', 'path': '/settings/document-types', 'parent': 'settings', 'is_enabled': True, 'sort_order': 57},
            {'name': 'settings_expense_categories', 'label': 'Expense Categories', 'path': '/settings/expense-categories', 'parent': 'settings', 'is_enabled': True, 'sort_order': 58},
            {'name': 'settings_roles_permissions', 'label': 'Roles & Permissions', 'path': '/settings/roles-permissions', 'parent': 'settings', 'is_enabled': True, 'sort_order': 59},
            {'name': 'settings_user_management', 'label': 'User Management', 'path': '/settings/user-management', 'parent': 'settings', 'is_enabled': True, 'sort_order': 60},
            {'name': 'settings_system_settings', 'label': 'System Settings', 'path': '/settings/system-settings', 'parent': 'settings', 'is_enabled': True, 'sort_order': 61},
        ]

        print(f"Creating {len(default_tabs)} tabs...")
        created_tabs = []
        for tab_data in default_tabs:
            tab = TabSetting(**tab_data)
            db.add(tab)
            created_tabs.append(tab)

        db.commit()
        print(f"Successfully created {len(created_tabs)} tabs!")

        # Assign all tabs to the users role
        users_role = db.query(Role).filter(Role.name == 'users').first()
        if users_role:
            print(f"\nAssigning all tabs to 'users' role...")
            users_role.tabs = created_tabs
            db.commit()
            print(f"Successfully assigned {len(created_tabs)} tabs to 'users' role!")
        else:
            print("Warning: 'users' role not found. Tabs created but not assigned.")

        print("\nTab initialization complete!")
        print(f"Total tabs in database: {db.query(TabSetting).count()}")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    initialize_all_tabs()
