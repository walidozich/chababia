from __future__ import annotations
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Float, Text
from sqlalchemy.sql import func
from db.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    icon = Column(String)
    status = Column(String, default="active")


class Establishment(Base):
    __tablename__ = "establishments"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String)
    commune = Column(String)
    wilaya = Column(String)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    phone = Column(String)
    email = Column(String)
    services = Column(Text)
    status = Column(String, default="active")
    last_verified_at = Column(DateTime)


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    short_description = Column(Text)
    full_description = Column(Text)
    category_id = Column(String)
    establishment_id = Column(String)
    commune = Column(String)        # added for locality matching
    activity_mode = Column(String)  # physical, online, hybrid
    start_datetime = Column(DateTime)
    end_datetime = Column(DateTime)
    registration_deadline = Column(DateTime)
    capacity = Column(Integer)
    requires_registration = Column(Boolean, default=True)
    is_free = Column(Boolean, default=True)
    age_min = Column(Integer)
    age_max = Column(Integer)
    language = Column(String)
    contact_phone = Column(String)
    contact_email = Column(String)
    status = Column(String, default="draft")
    last_verified_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    full_name = Column(String)
    email = Column(String)
    phone = Column(String)
    role = Column(String, default="youth")
    preferred_language = Column(String, default="ar")
    commune = Column(String)
    wilaya = Column(String)
    # Comma-separated interest category names e.g. "Sports,Environment,Science"
    interests = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    activity_id = Column(String, nullable=False)
    full_name = Column(String)
    phone = Column(String)
    email = Column(String)
    status = Column(String, default="registered")  # registered, attended, cancelled, waiting_list
    qr_code = Column(String)
    checked_in_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())