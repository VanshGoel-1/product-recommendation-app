from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import recommend
from app.api import analytics
from app.api import filters
from app.api import orders
from app.db.db import init_db

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
def on_startup():
    try:
        init_db()
    except Exception as e:
        print(f"WARNING: Database initialization failed. Ensure Postgres is running. Error: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.include_router(recommend.router)
app.include_router(analytics.router)
app.include_router(filters.router)
app.include_router(orders.router)

@app.get("/")
def root():
    """Root endpoint to avoid 404 on '/'. Returns a brief welcome message."""
    return {"message": f"{settings.PROJECT_NAME} backend is running. Visit /docs for API docs."}


@app.get("/healthz")
def health_check():
    return {"status": "ok"}
