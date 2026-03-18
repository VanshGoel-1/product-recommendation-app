# File: backend/app/api/analytics.py

from fastapi import APIRouter, Depends, HTTPException
import csv
from collections import Counter
import ast
from app.schemas.product import ProductAnalytics
from app.core.auth import get_auth_user

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])

# Define the path to your data file
DATA_FILE_PATH = "../data/products.csv"

@router.get("/summary", response_model=ProductAnalytics)
async def get_analytics_summary(
    user_claims: dict = Depends(get_auth_user)
):
    """
    Reads the product CSV and returns summary statistics
    for the analytics page.
    """
    try:
        brand_counter = Counter()
        category_counter = Counter()
        total_products = 0

        with open(DATA_FILE_PATH, mode='r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                total_products += 1
                
                # --- 1. Get Brands ---
                brand = row.get('brand')
                brand_counter[brand if brand else 'Unknown Brand'] += 1

                # --- 2. Get Categories ---
                categories_str = row.get('categories', '[]')
                if not categories_str:
                    categories_str = '[]'
                
                try:
                    categories_list = ast.literal_eval(categories_str)
                except (ValueError, SyntaxError):
                    categories_list = []
                
                main_category = "Unknown"
                if isinstance(categories_list, list):
                    if len(categories_list) > 1:
                        main_category = categories_list[1]
                    elif len(categories_list) > 0:
                        main_category = categories_list[0]
                
                category_counter[main_category] += 1

        # Equivalent to nlargest(10).to_dict()
        top_brands = dict(brand_counter.most_common(10))
        top_categories = dict(category_counter.most_common(10))

        return ProductAnalytics(
            brand_counts=top_brands,
            category_counts=top_categories,
            total_products=total_products
        )

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Data file not found.")
    except Exception as e:
        print(f"Error processing analytics summary: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")