import os
from dotenv import load_dotenv
from fastapi import HTTPException
from supabase import Client

from app.schemas.profiles import (
    SignInRequest,
    SignInResponse,
    SignUpRequest,
    SignUpResponse,
)

from app.db.database import get_supabase_client, get_supabase_admin

load_dotenv()
REDIRECT_URL = os.getenv("REDIRECT_URL")

class AuthService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.supabase_admin = get_supabase_admin()

    async def signup(self, data: SignUpRequest) -> SignUpResponse:
        try:
            print(data)
            role_value = data.role
            metadata = {
                "first_name": data.first_name,
                "last_name": data.last_name,
                "email": data.email,
                "role": role_value or "user",
                "avatar_url": data.avatar_url,
            }

            response = self.supabase.auth.sign_up(
                {
                    "email": data.email,
                    "password": data.password,
                    "options": {
                        "data": metadata,
                        "email_redirect_to": f"{REDIRECT_URL}/sign-in",
                    },
                }
            )

            user = response.user
            save_user_to_db = SignUpResponse(
                id=user.id,
                email=user.email,
                first_name=user.user_metadata.get("first_name"),
                last_name=user.user_metadata.get("last_name"),
                avatar_url=user.user_metadata.get("avatar_url"),
                role=user.user_metadata.get("role"),
            )
            self.save_user_to_db(save_user_to_db)

            return save_user_to_db
            
        except Exception as e:
            print(f"Signup error: {str(e)}")
            raise

    def sign_in_with_password(self, data: SignInRequest) -> SignInResponse:
        try:
            response = self.supabase.auth.sign_in_with_password(
                {"email": data.email, "password": data.password}
            )
            
            user = response.user
            # Fetch profile from DB to get the correct role
            profile_response = self.supabase_admin.table("profiles").select("*").eq("id", user.id).single().execute()
            profile_data = profile_response.data if profile_response else {}
            
            user_info = SignUpResponse(
                id=user.id,
                first_name=profile_data.get("first_name") or user.user_metadata.get("first_name"),
                last_name=profile_data.get("last_name") or user.user_metadata.get("last_name"),
                email=user.email,
                avatar_url=profile_data.get("avatar_url") or user.user_metadata.get("avatar_url"),
                role=profile_data.get("role") or user.user_metadata.get("role"),
            )
            
            return SignInResponse(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                user=user_info
            )
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error: {str(e)}",
            )

    def decode_token(self, token: str) -> SignUpResponse:
        try:
            response = self.supabase.auth.get_user(token)
            user = response.user
            
            # Fetch additional info from profiles table using admin client to bypass RLS
            profile_response = self.supabase_admin.table("profiles").select("*").eq("id", user.id).single().execute()
            profile_data = profile_response.data if profile_response else {}
            
            return SignUpResponse(
                id=user.id,
                first_name=profile_data.get("first_name") or user.user_metadata.get("first_name"),
                last_name=profile_data.get("last_name") or user.user_metadata.get("last_name"),
                email=user.email,
                avatar_url=profile_data.get("avatar_url") or user.user_metadata.get("avatar_url"),
                role=profile_data.get("role") or user.user_metadata.get("role"),
            )
        except Exception as e:
            raise HTTPException(
                status_code=401,
                detail=f"Error: {str(e)}",
            )

    def save_user_to_db(self, user_data: SignUpResponse):
        try:
            self.supabase_admin.table("profiles").insert(
                {
                    "id": user_data.id,
                    "first_name": user_data.first_name,
                    "last_name": user_data.last_name,
                    "email": user_data.email,
                    "avatar_url": user_data.avatar_url,
                    "role": user_data.role,
                }
            ).execute()
        except Exception as e:
            print(f"Error saving user to DB: {str(e)}")