from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(String, unique=True, index=True, nullable=False)
    category_name = Column(String, nullable=False)
    category_type = Column(String, nullable=False)
    parent_category = Column(String, nullable=True)
    description = Column(String, nullable=True)
    display_order = Column(Integer, default=0)
    status = Column(String, default="Active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
