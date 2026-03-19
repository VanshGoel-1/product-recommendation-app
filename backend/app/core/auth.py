from fastapi import HTTPException, Request
from starlette.status import HTTP_401_UNAUTHORIZED
from clerk_backend_api import Clerk
from clerk_backend_api.security import authenticate_request
from clerk_backend_api.security.types import AuthenticateRequestOptions
from app.core.config import settings

clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)

async def get_auth_user(request: Request) -> dict:
    try:
        request_state = clerk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=[
                    "http://localhost:5173",
                    "https://product-recommendation-app-wine.vercel.app",
                ]
            )
        )

        if not request_state.is_signed_in:
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail=request_state.reason,
            )

        # ✅ This is your JWT payload
        return request_state.payload

    except Exception as e:
        print("Authentication error:", e)
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
