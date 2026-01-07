from fastapi import APIRouter, Depends
from app.services.ai_service import get_ai_service, AIService
from app.core.auth import get_auth_user

router = APIRouter(prefix="/api/v1/filters", tags=["filters"])


@router.get("/brands")
async def get_brands(
    ai: AIService = Depends(get_ai_service),
    user_claims: dict = Depends(get_auth_user),
):
    """
    Returns unique brand names from Pinecone metadata.
    """
    try:
        index = ai.get_vector_index()

        # Dummy vector to fetch metadata (dimension must match your index)
        dummy_vector = [0.0] * index.describe_index_stats()["dimension"]

        result = index.query(
            vector=dummy_vector,
            top_k=1000,  # adjust if needed
            include_metadata=True,
        )

        brands = set()
        for match in result.get("matches", []):
            metadata = match.get("metadata") or {}
            brand = metadata.get("brand")
            if isinstance(brand, str) and brand.strip():
                brands.add(brand.strip())

        return sorted(brands)

    except Exception as e:
        print("Error reading brands from Pinecone:", e)
        return []
