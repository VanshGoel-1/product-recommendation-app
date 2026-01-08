from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Product(SQLModel, table=True):
    """Represents a product in the catalog."""
    id: Optional[int] = Field(default=None, primary_key=True)
    uniq_id: str = Field(index=True, nullable=False)
    title: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    categories: Optional[str] = None
    images: Optional[str] = None
    manufacturer: Optional[str] = None
    package_dimensions: Optional[str] = None
    country_of_origin: Optional[str] = None
    material: Optional[str] = None
    color: Optional[str] = None


class UserSearch(SQLModel, table=True):
    """Logs user search queries for analytics and personalization."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(index=True)
    query: str
    brand_filter: Optional[str] = None

    min_price: Optional[float] = None
    max_price: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Order(SQLModel, table=True):
    """Represents a customer order."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    items: str  # JSON string of items
    total_amount: float
    status: str = Field(default="pending")
    shipping_address: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

