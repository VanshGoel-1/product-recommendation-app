# File: backend/app/schemas/product.py

from pydantic import BaseModel, Field
from typing import List, Optional

class ProductBase(BaseModel):
    """Base schema for product attributes."""
    id: str = Field(..., description="Unique product identifier")
    title: Optional[str] = Field(None, description="Product title")
    brand: Optional[str] = Field(None, description="Product brand")
    price: Optional[float] = Field(None, description="Product price")
    images: Optional[List[str]] = Field(None, description="List of product image URLs")
    categories: Optional[str] = Field(None, description="Product categories string (as stored)")

class ProductSearchResult(ProductBase):
    """Schema for product data returned in search results."""
    score: float = Field(..., description="Relevance score from vector search")
    generated_description: Optional[str] = Field(None, description="AI-generated description")

    # Optional: Add configuration for ORM mode if connecting to a database later
    # class Config:
    #     orm_mode = True 
    #     # Pydantic V2 uses: from_attributes = True

class ProductAnalytics(BaseModel):
    """Schema for analytics summary data."""
    brand_counts: dict[str, int]
    category_counts: dict[str, int]
    total_products: int