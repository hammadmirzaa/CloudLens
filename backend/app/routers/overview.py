from fastapi import APIRouter
import asyncio
from typing import Any, Dict, Optional
from app.services.compute_service import compute_service
from app.services.cloudrun_service import cloudrun_service
from app.services.logs_service import logs_service
from app.services.billing_service import billing_service

router = APIRouter(prefix="/overview", tags=["overview"])

@router.get("")
async def get_overview():
    async def safe_call(coro):
        try:
            return await coro
        except Exception as e:
            print(f"Error in overview sub-call: {str(e)}")
            return None

    # Define the concurrent calls
    # 1. VM stats
    # 2. Cloud Run stats
    # 3. Recent logs (Alerts)
    # 4. Billing summary
    # 5. Global CPU util

    async def get_vm_stats():
        instances = await compute_service.list_instances()
        status_counts = {}
        for inst in instances:
            status = inst.get("status", "UNKNOWN")
            status_counts[status] = status_counts.get(status, 0) + 1
        return {
            "total_vms": len(instances),
            "by_status": status_counts
        }

    async def get_cloudrun_stats():
        services = await cloudrun_service.list_services()
        health_counts = {"HEALTHY": 0, "UNHEALTHY": 0, "UNKNOWN": 0}
        for svc in services:
            # Simple heuristic for health based on terminal condition
            is_ready = any(c.get("type") == "Terminal" and c.get("state") == "CONDITION_SUCCEEDED" for c in svc.get("conditions", []))
            if is_ready:
                health_counts["HEALTHY"] += 1
            else:
                health_counts["UNHEALTHY"] += 1
        return {
            "total_services": len(services),
            "by_health": health_counts
        }

    results = await asyncio.gather(
        safe_call(get_vm_stats()),
        safe_call(get_cloudrun_stats()),
        safe_call(logs_service.list_logs(severity="ERROR", limit=5)),
        safe_call(billing_service.get_summary()),
        safe_call(compute_service.get_total_cpu_utilization())
    )

    vm_stats, cr_stats, logs, billing, cpu_util = results

    return {
        "compute": vm_stats,
        "cloud_run": cr_stats,
        "recent_alerts": logs.entries if logs else [],
        "billing": billing,
        "global_cpu_utilization": cpu_util
    }
