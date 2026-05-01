from fastapi import FastAPI
from app.api import auth

app = FastAPI(title="Time Scheduler")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

@app.get("/")
def index():
    return {"status": "ok"}