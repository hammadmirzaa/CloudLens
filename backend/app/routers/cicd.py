from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from app.services.cicd_service import CICDService
from app.models.cicd import BuildInfo, TriggerInfo

router = APIRouter(prefix="/cicd", tags=["cicd"])

async def get_cicd_service():
    return CICDService()

@router.get("/builds", response_model=List[BuildInfo])
async def get_builds(
    status: Optional[str] = Query(None),
    trigger_id: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    service: CICDService = Depends(get_cicd_service)
):
    try:
        return await service.list_builds(status, trigger_id, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch builds: {str(e)}")

@router.get("/triggers", response_model=List[TriggerInfo])
async def get_triggers(service: CICDService = Depends(get_cicd_service)):
    try:
        return await service.list_triggers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch build triggers: {str(e)}")
