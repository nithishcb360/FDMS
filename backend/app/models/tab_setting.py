from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class TabSetting(Base):
    __tablename__ = "tab_settings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    label = Column(String, nullable=False)
    path = Column(String, nullable=True)
    parent = Column(String, nullable=True)  # For nested tabs
    icon = Column(String, nullable=True)  # SVG icon or icon name
    is_enabled = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to roles (imported at runtime to avoid circular imports)
    roles = relationship("Role", secondary="role_tabs", back_populates="tabs")
