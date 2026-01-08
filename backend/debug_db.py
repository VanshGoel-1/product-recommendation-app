import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load env vars
load_dotenv()

database_url = os.getenv("DATABASE_URL")

print(f"Loaded DATABASE_URL: {database_url}")

if not database_url:
    print("ERROR: DATABASE_URL is not set.")
    exit(1)

try:
    engine = create_engine(database_url)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("SUCCESS: Connected to database!")
        print(f"Test query result: {result.fetchone()}")
except Exception as e:
    print(f"FAILURE: Could not connect to database.")
    print(f"Error details: {e}")
