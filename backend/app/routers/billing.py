from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.services.billing_service import BillingService
from app.models.billing import BillingSummary, ServiceBilling, DailyBilling

router = APIRouter(prefix="/billing", tags=["billing"])

async def get_billing_service():
    return BillingService()

@router.get("/summary", response_model=BillingSummary)
async def get_summary(service: BillingService = Depends(get_billing_service)):
    try:
        return await service.get_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch billing summary: {str(e)}")

@router.get("/by-service", response_model=List[ServiceBilling])
async def get_by_service(service: BillingService = Depends(get_billing_service)):
    try:
        return await service.get_by_service()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch service billing: {str(e)}")

@router.get("/daily", response_model=List[DailyBilling])
async def get_daily(service: BillingService = Depends(get_billing_service)):
    try:
        return await service.get_daily()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch daily billing: {str(e)}")
