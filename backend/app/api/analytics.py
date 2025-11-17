# File: backend/app/api/analytics.py

from fastapi import APIRouter, Depends, HTTPException
import pandas as pd
import ast
from app.schemas.product import ProductAnalytics
from app.core.auth import get_auth_user

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])

# Define the path to your data file
DATA_FILE_PATH = "../data/products.csv"

@router.get("/summary", response_model=ProductAnalytics)
async def get_analytics_summary(
    # 3. Add the auth dependency here
    user_claims: dict = Depends(get_auth_user)
):
    """
    Reads the product CSV and returns summary statistics
    for the analytics page.
    """
    try:
        df = pd.read_csv(DATA_FILE_PATH)

        # --- 1. Get Top 10 Brands ---
        brand_counts = df['brand'].value_counts().nlargest(10).to_dict()

        # --- 2. Get Top 10 Main Categories ---
        df['categories'] = df['categories'].fillna('[]') # Use recommended fillna
        def safe_literal_eval(val):
            try:
                return ast.literal_eval(val)
            except (ValueError, SyntaxError):
                return []
        
        df['categories_list'] = df['categories'].apply(safe_literal_eval)
        df['main_category'] = df['categories_list'].apply(lambda x: x[1] if isinstance(x, list) and len(x) > 1 else (x[0] if isinstance(x,list) and len(x) > 0 else "Unknown"))
        category_counts = df['main_category'].value_counts().nlargest(10).to_dict()

        return ProductAnalytics(
            brand_counts= brand_counts,
            category_counts=category_counts,
            total_products=len(df)
        )

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Data file not found.")
    except Exception as e:
        print(f"Error processing analytics summary: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")