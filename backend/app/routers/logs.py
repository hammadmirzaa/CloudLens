from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional
from app.services.logs_service import LogsService
from app.models.logs import LogsResponse, LogResourcesResponse

router = APIRouter(prefix="/logs", tags=["logs"])

async def get_logs_service():
    return LogsService()

@router.get("", response_model=LogsResponse)
async def get_logs(
    resource: Optional[str] = Query(None),
    severity: Optional[str] = Query(None, pattern="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$"),
    limit: int = Query(50, ge=1, le=500),
    pageToken: Optional[str] = Query(None),
    service: LogsService = Depends(get_logs_service)
):
    try:
        return await service.list_logs(resource, severity, limit, pageToken)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch logs: {str(e)}")

@router.get("/resources", response_model=LogResourcesResponse)
async def get_resources(service: LogsService = Depends(get_logs_service)):
    try:
        resources = await service.list_resources()
        return LogResourcesResponse(resources=resources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch log resources: {str(e)}")
