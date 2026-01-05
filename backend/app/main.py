from fastapi import FastAPI
from app.api.v1.router import api_router
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.db import models

Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Chapter & Verse API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",  # expo web
        "http://localhost:19006", # older expo web
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"status": "ok"}
