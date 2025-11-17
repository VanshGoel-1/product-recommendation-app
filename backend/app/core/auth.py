# File: backend/app/core/auth.py

from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from clerk_backend_api import Clerk
from app.core.config import settings
from starlette.status import HTTP_401_UNAUTHORIZED

# 1. Initialize Clerk with your Secret Key from settings
clerk = Clerk(secret_key=settings.CLERK_SECRET_KEY)
# 2. Set up the "Bearer" token security scheme
bearer_scheme = HTTPBearer()

async def get_auth_user(creds: HTTPAuthorizationCredentials = Security(bearer_scheme)) -> dict:
    try:
        # 3. Get the token from the "Bearer" header
        token = creds.credentials
        
        # 4. Verify the token using Clerk's SDK
        session_claims = clerk.sessions.verify_token(token)
        
        if not session_claims:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
        # 5. Return the user's data
        return session_claims
    except Exception as e:
        print(f"Authentication error: {e}")
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")