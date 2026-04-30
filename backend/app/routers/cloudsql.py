from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models.cloudsql import CloudSQLInstance, CloudSQLMetrics, CloudSQLLogEntry
from app.services.cloudsql_service import cloudsql_service
import logging

router = APIRouter(tags=["Cloud SQL"])
logger = logging.getLogger(__name__)

@router.get("/instances", response_model=List[CloudSQLInstance])
async def list_instances():
    """
    List all Cloud SQL instances.
    """
    try:
        instances = await cloudsql_service.list_instances()
        return instances
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching Cloud SQL instances: {e}")
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")

@router.get("/instances/{instance_name}/metrics", response_model=CloudSQLMetrics)
async def get_instance_metrics(
    instance_name: str, 
    hours: int = Query(24, ge=1, le=168, description="Number of hours of metrics to fetch (max 168)")
):
    """
    Query Cloud Monitoring for Cloud SQL metrics (CPU/Memory utilization).
    """
    try:
        metrics = await cloudsql_service.get_instance_metrics(instance_name, hours)
        return metrics
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching Cloud SQL metrics for {instance_name}: {e}")
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")

@router.get("/instances/{instance_name}/logs", response_model=List[CloudSQLLogEntry])
async def get_instance_logs(
    instance_name: str, 
    limit: int = Query(20, ge=1, le=1000, description="Max number of log entries")
):
    """
    Query Cloud Logging for Cloud SQL logs.
    """
    try:
        logs = await cloudsql_service.get_instance_logs(instance_name, limit)
        return logs
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching Cloud SQL logs for {instance_name}: {e}")
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")
