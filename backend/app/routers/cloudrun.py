from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models.cloudrun import CloudRunService, CloudRunMetrics, CloudRunLogEntry
from app.services.cloudrun_service import cloudrun_service
import logging

router = APIRouter(tags=["Cloud Run"])
logger = logging.getLogger(__name__)

@router.get("/services", response_model=List[CloudRunService])
async def list_services():
    """
    List all Cloud Run services across all regions.
    """
    try:
        services = await cloudrun_service.list_services()
        return services
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching Cloud Run services: {e}")
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")

@router.get("/services/{service_name}/metrics", response_model=CloudRunMetrics)
async def get_service_metrics(
    service_name: str, 
    hours: int = Query(24, ge=1, le=168, description="Number of hours of metrics to fetch (max 168)")
):
    """
    Query Cloud Monitoring for instance metrics (Request count and latencies).
    """
    try:
        metrics = await cloudrun_service.get_service_metrics(service_name, hours)
        return metrics
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching Cloud Run metrics for {service_name}: {e}")
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")

@router.get("/services/{service_name}/logs", response_model=List[CloudRunLogEntry])
async def get_service_logs(
    service_name: str, 
    limit: int = Query(20, ge=1, le=1000, description="Max number of log entries")
):
    """
    Query Cloud Logging for service logs.
    """
    try:
        logs = await cloudrun_service.get_service_logs(service_name, limit)
        return logs
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching Cloud Run logs for {service_name}: {e}")
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")
