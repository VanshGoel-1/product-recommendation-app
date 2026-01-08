from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderCreate(BaseModel):
    items: List[dict] # Simplified for now, list of product objects
    total_amount: float
    shipping_address: str
    status: Optional[str] = "pending"

class OrderRead(BaseModel):
    id: int
    user_id: str
    items: str # JSON string
    total_amount: float
    status: str
    shipping_address: str
    created_at: datetime
