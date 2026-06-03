from __future__ import annotations
from sqlalchemy import Column, String, Boolean, Text, JSON, Index
from sqlalchemy.types import Numeric
from db.database import Base
 
# ---------------------------------------------------------------------------
# All column types derived from the exact SQLite DDL in DATABASE_SCHEMA.md.
#
# Key rules from the schema:
#   - All text fields:  TEXT DEFAULT '' NOT NULL  → String, default=""
#   - All bool fields:  BOOLEAN DEFAULT FALSE NOT NULL  → Boolean, default=False
#   - All number fields: NUMERIC DEFAULT 0 NOT NULL  → Numeric, default=0
#   - interests:  JSON DEFAULT '[]' NOT NULL  → JSON, default=[]
#   - timestamps (created/updated): TEXT (PocketBase auto-manages these)
#   - Relation fields are stored as plain TEXT (the related record's id)
# ---------------------------------------------------------------------------
 
 
class Category(Base):
    __tablename__ = "categories"
 
    id         = Column(String, primary_key=True)
    name       = Column(String, nullable=False, default="")
    icon       = Column(String, nullable=False, default="")
    status     = Column(String, nullable=False, default="")  # active | inactive
    created    = Column(String, nullable=False, default="")
    updated    = Column(String, nullable=False, default="")
    created_by = Column(String, nullable=False, default="")
    updated_by = Column(String, nullable=False, default="")
 
 
class Establishment(Base):
    __tablename__ = "establishments"
 
    id                  = Column(String, primary_key=True)
    name                = Column(String, nullable=False, default="")
    type                = Column(String, nullable=False, default="")  # youth_house | youth_hostel | sports_complex | youth_camp | polyvalent_hall | scientific_leisure_center
    commune             = Column(String, nullable=False, default="")
    wilaya              = Column(String, nullable=False, default="")
    address             = Column(String, nullable=False, default="")
    latitude            = Column(Numeric, nullable=False, default=0)
    longitude           = Column(Numeric, nullable=False, default=0)
    phone               = Column(String, nullable=False, default="")
    email               = Column(String, nullable=False, default="")
    opening_hours       = Column(String, nullable=False, default="")
    services            = Column(String, nullable=False, default="")
    accessibility_notes = Column(String, nullable=False, default="")
    image               = Column(String, nullable=False, default="")
    status              = Column(String, nullable=False, default="")  # draft | published | archived
    last_verified_at    = Column(String, nullable=False, default="")
    created             = Column(String, nullable=False, default="")
    updated             = Column(String, nullable=False, default="")
    created_by          = Column(String, nullable=False, default="")
    updated_by          = Column(String, nullable=False, default="")
 
 
class Activity(Base):
    __tablename__ = "activities"
 
    id                    = Column(String,  primary_key=True)
    title                 = Column(String,  nullable=False, default="")
    short_description     = Column(String,  nullable=False, default="")
    full_description      = Column(String,  nullable=False, default="")
    commune               = Column(String,  nullable=False, default="")
    wilaya                = Column(String,  nullable=False, default="")
    category              = Column(String,  nullable=False, default="")   # → categories.id
    establishment         = Column(String,  nullable=False, default="")   # → establishments.id
    activity_mode         = Column(String,  nullable=False, default="")   # physical | online | hybrid
    online_link           = Column(String,  nullable=False, default="")
    start_datetime        = Column(String,  nullable=False, default="")
    end_datetime          = Column(String,  nullable=False, default="")
    registration_deadline = Column(String,  nullable=False, default="")
    capacity              = Column(Numeric, nullable=False, default=0)
    requires_registration = Column(Boolean, nullable=False, default=False)
    is_free               = Column(Boolean, nullable=False, default=False)
    age_min               = Column(Numeric, nullable=False, default=0)
    age_max               = Column(Numeric, nullable=False, default=0)
    language              = Column(String,  nullable=False, default="")   # ar | fr | tzm | mixed
    accessibility_notes   = Column(String,  nullable=False, default="")
    required_documents    = Column(String,  nullable=False, default="")
    bandwidth_level       = Column(String,  nullable=False, default="")   # low | medium | high
    replay_available      = Column(Boolean, nullable=False, default=False)
    image                 = Column(String,  nullable=False, default="")
    contact_phone         = Column(String,  nullable=False, default="")
    contact_email         = Column(String,  nullable=False, default="")
    status                = Column(String,  nullable=False, default="")   # draft | published | cancelled | archived
    last_verified_at      = Column(String,  nullable=False, default="")
    created               = Column(String,  nullable=False, default="")
    updated               = Column(String,  nullable=False, default="")
    created_by            = Column(String,  nullable=False, default="")
    updated_by            = Column(String,  nullable=False, default="")
 
 
class User(Base):
    """
    Maps to the PocketBase `users` auth collection.
    We only map fields we actually read; auth internals
    (password, tokenKey) are omitted since we never query them.
    """
    __tablename__ = "users"
 
    id                 = Column(String,  primary_key=True)
    email              = Column(String,  nullable=False, default="")
    emailVisibility    = Column(Boolean, nullable=False, default=False)
    verified           = Column(Boolean, nullable=False, default=False)
    full_name          = Column(String,  nullable=False, default="")
    phone              = Column(String,  nullable=False, default="")
    role               = Column(String,  nullable=False, default="")   # youth | super_admin | wilaya_admin | establishment_manager | content_editor | attendance_staff
    preferred_language = Column(String,  nullable=False, default="")   # ar | fr | tzm
    commune            = Column(String,  nullable=False, default="")
    wilaya             = Column(String,  nullable=False, default="")
    # PocketBase stores multi-select as a JSON array: ["Sports","Environment"]
    interests          = Column(JSON,    nullable=False, default=list)
    created            = Column(String,  nullable=False, default="")
    updated            = Column(String,  nullable=False, default="")
 
 
class Registration(Base):
    __tablename__ = "registrations"
 
    id            = Column(String,  primary_key=True)
    user          = Column(String,  nullable=False, default="")   # → users.id
    activity      = Column(String,  nullable=False, default="")   # → activities.id
    full_name     = Column(String,  nullable=False, default="")
    phone         = Column(String,  nullable=False, default="")
    email         = Column(String,  nullable=False, default="")
    status        = Column(String,  nullable=False, default="")   # registered | waiting_list | cancelled | attended
    qr_code       = Column(String,  nullable=False, default="")
    checked_in_at = Column(String,  nullable=False, default="")
    created       = Column(String,  nullable=False, default="")
    updated       = Column(String,  nullable=False, default="")
    created_by    = Column(String,  nullable=False, default="")
    updated_by    = Column(String,  nullable=False, default="")
 
 
# Mirror the indexes from the schema
Index("idx_activities_status",        Activity.status)
Index("idx_activities_start_datetime",Activity.start_datetime)
Index("idx_activities_commune",       Activity.commune)
Index("idx_activities_wilaya",        Activity.wilaya)
Index("idx_activities_category",      Activity.category)
Index("idx_activities_establishment", Activity.establishment)
Index("idx_establishments_status",    Establishment.status)
Index("idx_establishments_commune",   Establishment.commune)
Index("idx_establishments_type",      Establishment.type)
Index("idx_registrations_user",       Registration.user)
Index("idx_registrations_activity",   Registration.activity)
Index("idx_registrations_status",     Registration.status)
Index("idx_users_role",               User.role)
Index("idx_users_commune",            User.commune)