from fastapi import FastAPI
from app.routers import auth, profiles

app = FastAPI(title="My API")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profiles.router)

@app.get("/")
def root():
    return {"message": "Hello World"}