from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models.gke import GKECluster, GKEMetrics, GKELogEntry
from app.services.gke_service import gke_service
import logging

router = APIRouter(tags=["GKE"])
logger = logging.getLogger(__name__)

@router.get("/clusters", response_model=List[GKECluster])
async def list_clusters():
    """
    List all GKE clusters.
    """
    try:
        clusters = await gke_service.list_clusters()
        return clusters
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching GKE clusters: {e}")
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")

@router.get("/clusters/{cluster_name}/metrics", response_model=GKEMetrics)
async def get_cluster_metrics(
    cluster_name: str, 
    hours: int = Query(24, ge=1, le=168, description="Number of hours of metrics to fetch (max 168)")
):
    """
    Query Cloud Monitoring for GKE metrics (CPU/Memory).
    """
    try:
        metrics = await gke_service.get_cluster_metrics(cluster_name, hours)
        return metrics
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching GKE metrics for {cluster_name}: {e}")
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")

@router.get("/clusters/{cluster_name}/logs", response_model=List[GKELogEntry])
async def get_cluster_logs(
    cluster_name: str, 
    limit: int = Query(20, ge=1, le=1000, description="Max number of log entries")
):
    """
    Query Cloud Logging for cluster logs.
    """
    try:
        logs = await gke_service.get_cluster_logs(cluster_name, limit)
        return logs
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching GKE logs for {cluster_name}: {e}")
        raise HTTPException(status_code=503, detail=f"GCP API Error: {str(e)}")
