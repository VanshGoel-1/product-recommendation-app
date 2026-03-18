# File: backend/app/api/recommend.py

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.product import ProductSearchResult
from app.services.ai_service import get_ai_service, AIService
import asyncio
import ast

# Auth dependency
from app.core.auth import get_auth_user
from app.core.limiter import limiter
from fastapi import Request

router = APIRouter(prefix="/api/v1/recommend", tags=["recommend"])


class QueryIn(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    top_k: int = Field(5, ge=1, le=20, description="Number of results to return")
    brand_filter: Optional[str] = Field(None, description="Filter results by brand name")
    min_price: Optional[float] = Field(None, ge=0, description="Minimum price filter")
    max_price: Optional[float] = Field(None, ge=0, description="Maximum price filter")


async def generate_description_for_match(
    ai: AIService,
    match: dict
) -> ProductSearchResult:
    metadata = match.get("metadata") or {}

    # ---- FIX 1: title may be a list, force string ----
    title = metadata.get("title", "this product")
    if isinstance(title, list):
        title = title[0] if title else "this product"

    chain = ai.get_prompt() | ai.get_llm()
    gen_description = await chain.ainvoke({
        "title": str(title),
        "brand": str(metadata.get("brand", "Unknown Brand")),
        "price": str(metadata.get("price", "N/A")),
        "categories": str(metadata.get("categories", "General"))
    })

    # ---- Parse images safely ----
    image_list: List[str] = []
    if metadata.get("images"):
        try:
            parsed_list = ast.literal_eval(metadata.get("images", "[]"))
            if isinstance(parsed_list, list):
                image_list = [str(item).strip() for item in parsed_list if item]
        except (ValueError, SyntaxError):
            image_list = []

    # ---- Convert Price to INR (Dataset is USD, UI is INR) ----
    usd_price = metadata.get("price")
    try:
        if usd_price is not None:
             inr_price = float(usd_price) * 90.0
        else:
             inr_price = 0.0
    except (ValueError, TypeError):
        inr_price = 0.0

    return ProductSearchResult(
        id=match.get("id", ""),
        score=match.get("score", 0),
        title=title,
        brand=metadata.get("brand"),
        price=inr_price,
        images=image_list,
        categories=metadata.get("categories"),
        generated_description=gen_description.content,
    )


@router.post("/search", response_model=List[ProductSearchResult])
@limiter.limit("20/minute")
async def search(
    request: Request,
    payload: QueryIn,
    ai: AIService = Depends(get_ai_service),
    user_claims: dict = Depends(get_auth_user),
):
    user_id = user_claims.get("sub")
    print(f"Authenticated search query by user: {user_id}")

    # ---- Embed query ----
    try:
        query_vector = ai.get_embeddings_model().embed_query(payload.query)
    except Exception as e:
        print(f"Error embedding query: {e}")
        raise HTTPException(status_code=500, detail="Failed to process search query.")

    # ---- Build Pinecone filters ----
    pinecone_filter = {}

    if payload.brand_filter:
        pinecone_filter["brand"] = {"$eq": payload.brand_filter}

    price_filter = {}
    
    # Conversion rate: 1 USD = 90 INR
    # Dataset is in USD, filters are in INR
    if payload.min_price is not None:
        price_filter["$gte"] = payload.min_price / 90.0
    if payload.max_price is not None:
        # Convert max_price to USD for filtering
        max_p_usd = payload.max_price / 90.0
        min_p_usd = (payload.min_price / 90.0) if payload.min_price is not None else 0
        
        if payload.min_price is None or payload.max_price >= payload.min_price:
            price_filter["$lte"] = max_p_usd
        else:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Invalid price range: max_price ({payload.max_price}) "
                    f"cannot be less than min_price ({payload.min_price})."
                ),
            )

    if price_filter:
        pinecone_filter["price"] = price_filter

    # ---- Query vector DB ----
    try:
        results = ai.get_vector_index().query(
            vector=query_vector,
            top_k=payload.top_k,
            filter=pinecone_filter if pinecone_filter else None,
            include_metadata=True,
        )
    except Exception as e:
        print(f"Error querying Pinecone: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error retrieving search results from vector database.",
        )

    matches = results.get("matches", [])
    if not matches:
        return []

    # ---- FIX 2: correct asyncio.gather usage ----
    try:
        tasks = [generate_description_for_match(ai, match) for match in matches]
        final_results = await asyncio.gather(*tasks)
    except Exception as e:
        print(f"Error generating descriptions for results: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error processing search results.",
        )

    return final_results

# # File: backend/app/api/recommend.py

# from fastapi import APIRouter, Depends, HTTPException
# from pydantic import BaseModel, Field
# from typing import List, Optional
# from app.schemas.product import ProductSearchResult
# from app.services.ai_service import get_ai_service, AIService
# import asyncio
# import ast

# # 1. Import the new authentication dependency
# from app.core.auth import get_auth_user

# router = APIRouter(prefix="/api/v1/recommend", tags=["recommend"])

# # ... (QueryIn schema is unchanged) ...
# class QueryIn(BaseModel):
#     query: str
#     top_k: int = 5
#     brand_filter: Optional[str] = Field(None, description="Filter results by brand name")
#     min_price: Optional[float] = Field(None, ge=0, description="Minimum price filter")
#     max_price: Optional[float] = Field(None, ge=0, description="Maximum price filter")

# # ... (generate_description_for_match function is unchanged) ...
# async def generate_description_for_match(ai: AIService, match: dict) -> ProductSearchResult:
#     metadata = match.get('metadata', {})
    
#     chain = ai.get_prompt() | ai.get_llm()
#     gen_description_task = chain.ainvoke({"title": metadata.get('title', 'this product')})
    
#     image_list = []
#     if metadata.get('images'):
#         try:
#             parsed_list = ast.literal_eval(metadata.get('images', '[]'))
#             if isinstance(parsed_list, list):
#                 image_list = [str(item).strip() for item in parsed_list if item]
#         except (ValueError, SyntaxError):
#             image_list = []
            
#     gen_description = await gen_description_task
            
#     return ProductSearchResult(
#         id=match.get('id', ''),
#         score=match.get('score', 0),
#         title=metadata.get('title'),
#         brand=metadata.get('brand'),
#         price=metadata.get('price'),
#         images=image_list,
#         categories=metadata.get('categories'),
#         generated_description=gen_description.content
#     )

# # --- UPDATE THE SEARCH ENDPOINT ---
# @router.post("/search", response_model=List[ProductSearchResult])
# async def search(
#     payload: QueryIn,
#     ai: AIService = Depends(get_ai_service),
#     # 2. Add the auth dependency here
#     user_claims: dict = Depends(get_auth_user) 
# ):
#     # 3. (Optional) You can now access the user's ID
#     user_id = user_claims.get("sub")
#     print(f"Authenticated search query by user: {user_id}")
    
#     # ... (rest of the function is unchanged) ...
#     try:
#         query_vector = ai.get_embeddings_model().embed_query(payload.query)
#     except Exception as e:
#         print(f"Error embedding query: {e}")
#         raise HTTPException(status_code=500, detail="Failed to process search query.")

#     pinecone_filter = {}
#     if payload.brand_filter:
#         pinecone_filter["brand"] = {"$eq": payload.brand_filter}

#     price_filter = {}
#     if payload.min_price is not None:
#         price_filter["$gte"] = payload.min_price
#     if payload.max_price is not None:
#         if payload.min_price is None or payload.max_price >= payload.min_price:
#              price_filter["$lte"] = payload.max_price
#         else:
#              raise HTTPException(
#                  status_code=400,
#                  detail=f"Invalid price range: max_price ({payload.max_price}) cannot be less than min_price ({payload.min_price})."
#              )

#     if price_filter:
#         pinecone_filter["price"] = price_filter 
    
#     try:
#         results = ai.get_vector_index().query(
#             vector=query_vector,
#             top_k=payload.top_k,
#             filter=pinecone_filter if pinecone_filter else None,
#             include_metadata=True
#         )
#     except Exception as e:
#         print(f"Error querying Pinecone: {e}")
#         raise HTTPException(status_code=500, detail="Error retrieving search results from vector database.")
    
#     matches = results.get('matches', [])
#     if not matches:
#         return []

#     try:
#         tasks = [generate_description_for_match(ai, match) for match in matches]
#         final_results = await asyncio.gather(tasks)
#     except Exception as e:
#         print(f"Error generating descriptions for results: {e}")
#         raise HTTPException(status_code=500, detail="Error processing search results.")

#     return final_results