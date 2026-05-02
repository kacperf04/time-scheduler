import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api

load_dotenv()

app = FastAPI(title="Time Scheduler")

cors_origins_str = os.getenv("BACKEND_CORS_ORIGINS")
origins = cors_origins_str.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api.api_router, prefix="/api/v1")

@app.get("/")
def index():
    return {"status": "ok"}