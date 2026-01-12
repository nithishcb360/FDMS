from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from ..core.database import Base


class ReligiousRite(Base):
    __tablename__ = "religious_rites"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    religion = Column(String(100), nullable=False)  # e.g., "Buddhist", "Catholic", "Hindu", "Islamic", "Jewish"
    rite_name = Column(String(200), nullable=False)  # e.g., "Buddhist Funeral Ceremony"
    description = Column(Text, nullable=True)  # Description of the religious rite

    # Duration & Requirements
    duration_minutes = Column(Integer, default=60)  # Duration in minutes
    special_requirements = Column(Text, nullable=True)  # e.g., "Monk required. Incense and altar setup."

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
