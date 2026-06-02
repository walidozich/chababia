# Registers all routes

from fastapi import APIRouter
from api.routes.recommendations import router as feed_router
 
api_router = APIRouter()
api_router.include_router(feed_router)