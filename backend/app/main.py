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


@app.get("/")
def root():
    return {"message": "Landing Page API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
