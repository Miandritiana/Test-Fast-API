from fastapi import APIRouter, Depends, HTTPException
from app.services.auth.auth import AuthService
from app.schemas.profiles import (
    SignInRequest,
    SignInResponse,
    SignUpRequest,
    SignUpResponse,
)

router = APIRouter()


def get_auth_service():
    return AuthService()


@router.post("/sign_up", response_model=SignUpResponse)
async def create_profiles(
    data: SignUpRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    try:
        return await auth_service.signup(data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/sign_in_with_password", response_model=SignInResponse)
def sign_in(
    data: SignInRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    try:
        return auth_service.sign_in_with_password(data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
