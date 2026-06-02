# Pydantic request/response models
from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional


class FeedRequest(BaseModel):
    user_id: str = Field(..., example="user_abc123")


class ActivityCard(BaseModel):
    """
    Minimal activity data returned in the personalized feed.
    Full details are loaded only when the user opens the activity.
    """
    id: str
    title: str
    category: Optional[str]
    commune: Optional[str]
    activity_mode: Optional[str]
    is_free: Optional[bool]
    score: float = Field(..., description="Cosine similarity score (0.0 – 1.0)")


class FeedResponse(BaseModel):
    user_id: str
    items: list[ActivityCard]
    cached: bool = False
    profile_summary: str = Field(
        ...,
        description="Human-readable summary of what was used to build the user's taste profile."
    )