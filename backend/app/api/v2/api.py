from fastapi import APIRouter
from app.api.v2.endpoints import auth, demands

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(demands.router, prefix="/demands", tags=["demands"])