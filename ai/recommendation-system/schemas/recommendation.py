# Pydantic request/response models
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field


class FeedRequest(BaseModel):
    user_id: str = Field(..., example="abc123def456xyz")


class ActivityCard(BaseModel):
    """
    Minimal activity payload for the feed card.
    Mirrors the list response shape from API section 14.1.
    Full details only load when the user opens the activity.
    """
    id:            str
    title:         str
    category:      Optional[str] = None   # category id
    category_name: Optional[str] = None   # display name
    commune:       Optional[str] = None
    wilaya:        Optional[str] = None
    activity_mode: Optional[str] = None   # physical | online | hybrid
    is_free:       Optional[bool] = None
    score:         float = Field(..., description="Cosine similarity score (0.0 – 1.0)")


class FeedResponse(BaseModel):
    user_id:         str
    items:           list[ActivityCard]
    cached:          bool = False
    profile_summary: str = Field(
        ...,
        description="Human-readable summary of inputs used to build this user's taste profile."
    )