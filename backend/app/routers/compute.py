from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models.compute import ComputeInstance, ComputeMetrics
from app.services.compute_service import compute_service
import logging

router = APIRouter(tags=["Compute"])
logger = logging.getLogger(__name__)

@router.get("/instances", response_model=List[ComputeInstance])
async def list_instances():
    """
    List all VM instances across all zones in the project.
    """
    try:
        instances = await compute_service.list_instances()
        return instances
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching compute instances: {e}")
        # GCP API errors gracefully return 503
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")

@router.get("/instances/{instance_name}/metrics", response_model=ComputeMetrics)
async def get_instance_metrics(
    instance_name: str, 
    hours: int = Query(1, ge=1, le=24, description="Number of hours of metrics to fetch (max 24)")
):
    """
    Query Cloud Monitoring for instance metrics (CPU utilization and Memory).
    """
    try:
        metrics = await compute_service.get_instance_metrics(instance_name, hours)
        return metrics
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching compute metrics for {instance_name}: {e}")
        # GCP API errors gracefully return 503
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")
