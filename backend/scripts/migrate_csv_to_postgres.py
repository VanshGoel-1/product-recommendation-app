import os
import sys
import pandas as pd
from sqlmodel import Session
from sqlalchemy import text
from dotenv import load_dotenv

# --- Ensure backend/app is importable even when run from project root ---
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(os.path.join(BASE_DIR, "backend"))

from app.db.db import engine, init_db
from app.models.models import Product


# --- Load environment variables ---
ENV_PATH = os.path.join(BASE_DIR, "backend", ".env")
load_dotenv(dotenv_path=ENV_PATH)

# --- Correct CSV path ---
CSV_PATH = os.path.join(BASE_DIR, "data", "products.csv")


def clean_price(value):
    """Convert price string like '$24.99' to float."""
    try:
        value = str(value)
        value = ''.join(ch for ch in value if (ch.isdigit() or ch == '.'))
        return float(value) if value else None
    except Exception:
        return None


def main():
    print("Initializing database...")
    init_db()

    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"CSV file not found at: {CSV_PATH}")

    print("Reading CSV file...")
    df = pd.read_csv(CSV_PATH)
    print(f"Loaded {len(df)} rows")

    # Clean price
    df["price_numeric"] = df["price"].apply(clean_price)

    with Session(engine) as session:
        session.exec(text("DELETE FROM product"))
        session.commit()

        inserted = 0
        skipped = 0

        for _, row in df.iterrows():
            try:
                price_val = row.get("price_numeric")
                if isinstance(price_val, str):
                    price_val = clean_price(price_val)

                product = Product(
                    uniq_id=str(row.get("uniq_id", "")),
                    title=str(row.get("title")) if pd.notna(row.get("title")) else None,
                    brand=str(row.get("brand")) if pd.notna(row.get("brand")) else None,
                    description=str(row.get("description")) if pd.notna(row.get("description")) else None,
                    price=float(price_val) if pd.notna(price_val) else None,
                    categories=str(row.get("categories")) if pd.notna(row.get("categories")) else None,
                    images=str(row.get("images")) if pd.notna(row.get("images")) else None,
                    manufacturer=str(row.get("manufacturer")) if pd.notna(row.get("manufacturer")) else None,
                    package_dimensions=str(row.get("package_dimensions")) if pd.notna(row.get("package_dimensions")) else None,
                    country_of_origin=str(row.get("country_of_origin")) if pd.notna(row.get("country_of_origin")) else None,
                    material=str(row.get("material")) if pd.notna(row.get("material")) else None,
                    color=str(row.get("color")) if pd.notna(row.get("color")) else None,
                )
                session.add(product)
                inserted += 1
            except Exception as e:
                print(f"⚠️ Skipping row due to error: {e}")
                skipped += 1

        session.commit()
        print(f"✅ Inserted {inserted} products into the database. Skipped {skipped} problematic rows.")


if __name__ == "__main__":
    main()
