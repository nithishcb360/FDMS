from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine, Base
from .api import contact, cases, schedules, arrangements, venue_bookings, service_addons, vehicles
from .api import next_of_kin as next_of_kin_api
from .api import case_notes as case_notes_api
from .api import assignments as assignments_api
from .api import products as products_api
from .api import categories as categories_api
from .api import vehicle_assignments
from .api import fuel_logs
from .api import suppliers as suppliers_api
from .api import staff as staff_api
from .api import tasks as tasks_api
from .api import staff_schedules as staff_schedules_api
from .api import time_logs as time_logs_api
from .api import invoices as invoices_api
from .api import payments as payments_api
from .api import expenses as expenses_api
from .api import transactions as transactions_api
from .api import families as families_api
from .api import communications as communications_api
from .api import followups as followups_api
from .api import preneeds as preneeds_api
from .api import branches as branches_api
from .api import service_types as service_types_api
from .api import service_packages as service_packages_api
from .api import venue_types as venue_types_api
from .api import tax_codes as tax_codes_api
from .api import payment_modes as payment_modes_api
from .api import religious_rites as religious_rites_api
from .api import document_types as document_types_api
from .api import auth as auth_api
from .api import tab_settings as tab_settings_api
from .api import roles as roles_api

# Import models to ensure they are registered with Base
from .models import case as case_model
from .models import next_of_kin as next_of_kin_model
from .models import case_note as case_note_model
from .models import assignment as assignment_model
from .models import product as product_model
from .models import category as category_model
from .models import vehicle as vehicle_model
from .models import vehicle_assignment as vehicle_assignment_model
from .models import fuel_log as fuel_log_model
from .models import supplier as supplier_model
from .models import staff as staff_model
from .models import task as task_model
from .models import schedule as staff_schedule_model
from .models import time_log as time_log_model
from .models import invoice as invoice_model
from .models import payment as payment_model
from .models import expense as expense_model
from .models import transaction as transaction_model
from .models import family as family_model
from .models import communication as communication_model
from .models import followup as followup_model
from .models import preneed as preneed_model
from .models import branch as branch_model
from .models import service_type as service_type_model
from .models import service_package as service_package_model
from .models import venue_type as venue_type_model
from .models import tax_code as tax_code_model
from .models import payment_mode as payment_mode_model
from .models import religious_rite as religious_rite_model
from .models import document_type as document_type_model
from .models import user as user_model
from .models import tab_setting as tab_setting_model
from .models import role as role_model

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FDMS API",
    description="Funeral Director Management System API",
    version="1.0.0",
    redirect_slashes=False
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(contact.router, prefix="/api")
app.include_router(cases.router, prefix="/api/cases", tags=["cases"])
app.include_router(schedules.router, prefix="/api/schedules", tags=["schedules"])
app.include_router(arrangements.router, prefix="/api/arrangements", tags=["arrangements"])
app.include_router(venue_bookings.router, prefix="/api/venue-bookings", tags=["venue-bookings"])
app.include_router(service_addons.router, prefix="/api/service-addons", tags=["service-addons"])
app.include_router(next_of_kin_api.router, prefix="/api/next-of-kin", tags=["next-of-kin"])
app.include_router(case_notes_api.router, prefix="/api/case-notes", tags=["case-notes"])
app.include_router(assignments_api.router, prefix="/api/assignments", tags=["assignments"])
app.include_router(products_api.router, prefix="/api/products", tags=["products"])
app.include_router(categories_api.router, prefix="/api/categories", tags=["categories"])
app.include_router(vehicles.router, prefix="/api/vehicles", tags=["vehicles"])
app.include_router(vehicle_assignments.router, prefix="/api/vehicle-assignments", tags=["vehicle-assignments"])
app.include_router(fuel_logs.router, prefix="/api/fuel-logs", tags=["fuel-logs"])
app.include_router(suppliers_api.router, prefix="/api/suppliers", tags=["suppliers"])
app.include_router(staff_api.router, prefix="/api/staff", tags=["staff"])
app.include_router(tasks_api.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(staff_schedules_api.router, prefix="/api/staff-schedules", tags=["staff-schedules"])
app.include_router(time_logs_api.router, prefix="/api/time-logs", tags=["time-logs"])
app.include_router(invoices_api.router, prefix="/api/invoices", tags=["invoices"])
app.include_router(payments_api.router, prefix="/api/payments", tags=["payments"])
app.include_router(expenses_api.router, prefix="/api/expenses", tags=["expenses"])
app.include_router(transactions_api.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(families_api.router, prefix="/api/families", tags=["families"])
app.include_router(communications_api.router, prefix="/api/communications", tags=["communications"])
app.include_router(followups_api.router, prefix="/api/followups", tags=["followups"])
app.include_router(preneeds_api.router, prefix="/api/preneeds", tags=["preneeds"])
app.include_router(branches_api.router, prefix="/api/branches", tags=["branches"])
app.include_router(service_types_api.router, prefix="/api/service-types", tags=["service-types"])
app.include_router(service_packages_api.router, prefix="/api/service-packages", tags=["service-packages"])
app.include_router(venue_types_api.router, prefix="/api/venue-types", tags=["venue-types"])
app.include_router(tax_codes_api.router, prefix="/api/tax-codes", tags=["tax-codes"])
app.include_router(payment_modes_api.router, prefix="/api/payment-modes", tags=["payment-modes"])
app.include_router(religious_rites_api.router, prefix="/api/religious-rites", tags=["religious-rites"])
app.include_router(document_types_api.router, prefix="/api/document-types", tags=["document-types"])
app.include_router(auth_api.router, prefix="/api/auth", tags=["authentication"])
app.include_router(tab_settings_api.router, prefix="/api/tab-settings", tags=["tab-settings"])
app.include_router(roles_api.router, prefix="/api/roles", tags=["roles"])


@app.get("/")
def root():
    return {"message": "Landing Page API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/test-auth-loaded")
def test_auth():
    """Test if auth router is loaded"""
    auth_routes = [route.path for route in app.routes if hasattr(route, 'path') and '/auth' in route.path]
    return {
        "auth_routes_loaded": len(auth_routes) > 0,
        "auth_routes": auth_routes,
        "total_routes": len(app.routes)
    }
