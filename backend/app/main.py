from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import compute, cloudrun, gke, cloudsql

app = FastAPI(
    title="GCP Infrastructure Monitoring Dashboard API",
    description="Backend API for GCP Monitoring Dashboard",
    version="1.0.0",
)

# CORS Middleware (allow all origins in dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(compute.router, prefix="/api/compute")
app.include_router(cloudrun.router, prefix="/api/cloudrun")
app.include_router(gke.router, prefix="/api/gke")
app.include_router(cloudsql.router, prefix="/api/cloudsql")

@app.get("/health")
async def health_check():
    return {"status": "ok", "project": settings.gcp_project_id}
