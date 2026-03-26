from datetime import datetime
import enum
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr

from app.db.models import RoleUser

class Profiles(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    password: str
    avatar_url: Optional[str] = None
    role: Optional[str] = "user"

class SignUpRequest(Profiles):
    pass

class SignUpResponse(BaseModel):
    id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    avatar_url: Optional[str] = None
    role: Optional[str] = None

class ProfilesAuth(SignUpResponse):
    pass

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class SignInResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    user: SignUpResponse

class ProfilesResponse(Profiles):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]
