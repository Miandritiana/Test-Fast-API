from fastapi import FastAPI
from app.routers import auth

app = FastAPI(title="My API")

app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/")
def root():
    return {"message": "Hello World"}