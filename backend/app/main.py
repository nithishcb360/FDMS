from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine, Base
from .api import contact, cases

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


@app.get("/")
def root():
    return {"message": "Landing Page API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
