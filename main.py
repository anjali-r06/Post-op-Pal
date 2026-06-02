# main.py

from fastapi import FastAPI
from recovery_routes import router as recovery_router

app = FastAPI(
    title="Post-Op Pal API",
    description="AI-powered post-surgical recovery assistant",
    version="1.0.0"
)

# Register the recovery module routes
app.include_router(recovery_router)

@app.get("/")
def root():
    return {"message": "Post-Op Pal API is running ✅"}