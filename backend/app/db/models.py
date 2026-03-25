"""
Modèles SQLAlchemy — utilisés UNIQUEMENT pour Alembic (génération de migrations).
:warning: Ne JAMAIS utiliser ces modèles pour des requêtes. Utiliser le SDK Supabase.
"""

import uuid
import enum
from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    Enum,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase



class Base(DeclarativeBase):
    """Classe de base pour tous les modèles SQLAlchemy."""
    pass

class RoleUser(enum.Enum):
    admin = "admin"
    superadmin = "superadmin"
    member = "member"

class Profile(Base):
    """Table profiles liée à auth.users via trigger Supabase."""

    __tablename__ = "profiles"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        comment="Clé primaire, référence auth.users(id)",
    )
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    email = Column(String(255), nullable=False)
    role = Column(
        Enum(RoleUser, name="role_user"),
        nullable=False,
        server_default=text("'user'"),
    )
    avatar_url = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("NOW()"),
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("NOW()"),
    )

    __table_args__ = (
        CheckConstraint("role IN ('user', 'admin')", name="ck_profiles_role"),
        Index("idx_profiles_email", "email"),
    )