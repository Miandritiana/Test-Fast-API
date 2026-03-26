from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth.auth import AuthService
from app.schemas.profiles import SignUpResponse

router = APIRouter(prefix="/profiles", tags=["profiles"])

security = HTTPBearer()


def get_auth_service():
    return AuthService()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
) -> SignUpResponse:
    try:
        token = credentials.credentials
        # Log token prefix for debugging
        print(f"DEBUG: Received token starting with: {token[:10]}...")
        return auth_service.decode_token(token)
    except Exception as e:
        print(f"DEBUG: Auth error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_admin(
    current_user: SignUpResponse = Depends(get_current_user),
) -> SignUpResponse:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges",
        )
    return current_user


@router.get("/user", response_model=SignUpResponse)
async def get_user_profile(
    current_user: SignUpResponse = Depends(get_current_user),
):
    """
    Endpoint accessible by any authenticated user.
    """
    return current_user


@router.get("/admin", response_model=SignUpResponse)
async def get_admin_profile(
    current_admin: SignUpResponse = Depends(get_current_admin),
):
    """
    Endpoint accessible only by admin users.
    """
    return current_admin


@router.get("", response_model=List[SignUpResponse])
async def list_profiles(
    current_admin: SignUpResponse = Depends(get_current_admin),
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Endpoint accessible only by admin users to list all profiles.
    """
    try:
        response = (
            auth_service.supabase_admin.table("profiles").select("*").execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching profiles: {str(e)}",
        )
