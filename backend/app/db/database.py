from supabase import create_client, Client

from dotenv import load_dotenv

import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

def get_supabase_client() -> Client:
    """Client Supabase avec clé anonyme (opérations utilisateur)."""
    return create_client(SUPABASE_URL, SUPABASE_API_KEY)


def get_supabase_admin() -> Client:
    """Client Supabase avec clé service_role (opérations admin)."""
    return create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)