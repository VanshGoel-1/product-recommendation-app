from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import select
from app.db.db import get_session
from app.models.models import Product
from app.core.auth import get_auth_user


router = APIRouter(prefix="/api/v1/filters", tags=["filters"])


@router.get("/brands", response_model=List[str])
async def get_unique_brands(
    user_claims: dict = Depends(get_auth_user),
    session=Depends(get_session)
):
    """Return sorted unique brand names from PostgreSQL."""
    try:
        stmt = select(Product.brand).where(Product.brand.is_not(None))
        rows = session.exec(stmt).all()
        brands = sorted({r for r in rows if r})
        return brands
    except Exception as e:
        print("Error reading brands:", e)
        raise HTTPException(status_code=500, detail="Failed to retrieve brand list")
