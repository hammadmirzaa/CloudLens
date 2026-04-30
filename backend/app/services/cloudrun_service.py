import asyncio
from typing import List, Dict, Any
from google.cloud import run_v2
from google.cloud import monitoring_v3
from google.cloud import logging as cloud_logging
from google.protobuf.timestamp_pb2 import Timestamp
import time
from datetime import datetime, timezone
from app.config import settings

class CloudRunServiceService:
    def __init__(self):
        self.project_id = settings.gcp_project_id
        self._services_client = None
        self._monitoring_client = None
        self._logging_client = None

    @property
    def services_client(self):
        if self._services_client is None:
            self._services_client = run_v2.ServicesClient()
        return self._services_client

    @property
    def monitoring_client(self):
        if self._monitoring_client is None:
            self._monitoring_client = monitoring_v3.MetricServiceClient()
        return self._monitoring_client
        
    @property
    def logging_client(self):
        if self._logging_client is None:
            self._logging_client = cloud_logging.Client(project=self.project_id)
        return self._logging_client

    async def list_services(self) -> List[Dict[str, Any]]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._list_services_sync)

    def _list_services_sync(self) -> List[Dict[str, Any]]:
        if not self.project_id:
            raise ValueError("GCP_PROJECT_ID is not configured")
            
        request = run_v2.ListServicesRequest(
            parent=f"projects/{self.project_id}/locations/-"
        )
        
        page_result = self.services_client.list_services(request=request)
        
        services_list = []
        for service in page_result:
            # name format: projects/project-id/locations/region/services/service-name
            parts = service.name.split('/')
            region = parts[3] if len(parts) > 3 else "unknown"
            name = parts[-1] if len(parts) > 0 else "unknown"
            
            conditions = []
            for cond in service.terminal_condition:
                conditions.append({
                    "type": "Terminal",
                    "state": str(cond.state),
                    "message": cond.message
                })
            # Add general conditions
            for cond in service.conditions:
                conditions.append({
                    "type": cond.type_,
                    "state": cond.state.name,
                    "message": cond.message
                })
                
            services_list.append({
                "name": name,
                "region": region,
                "uri": service.uri,
                "latestRevision": service.latest_ready_revision,
                "conditions": conditions,
                "createTime": service.create_time.isoformat() if service.create_time else "",
                "updateTime": service.update_time.isoformat() if service.update_time else ""
            })
            
        return services_list

    async def get_service_metrics(self, service_name: str, hours: int = 24) -> Dict[str, Any]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._get_service_metrics_sync, service_name, hours)

    def _get_service_metrics_sync(self, service_name: str, hours: int) -> Dict[str, Any]:
        if not self.project_id:
            raise ValueError("GCP_PROJECT_ID is not configured")

        now = time.time()
        seconds = int(now)
        nanos = int((now - seconds) * 10 ** 9)
        
        start_time = now - (hours * 3600)
        start_seconds = int(start_time)
        start_nanos = int((start_time - start_seconds) * 10 ** 9)

        interval = monitoring_v3.TimeInterval(
            {
                "end_time": Timestamp(seconds=seconds, nanos=nanos),
                "start_time": Timestamp(seconds=start_seconds, nanos=start_nanos),
            }
        )

        project_name = f"projects/{self.project_id}"
        
        def fetch_metric(metric_type: str, aligner=None):
            req = {
                "name": project_name,
                "filter": f'metric.type = "{metric_type}" AND resource.labels.service_name = "{service_name}"',
                "interval": interval,
                "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
            }
            if aligner:
                req["aggregation"] = {
                    "alignment_period": {"seconds": 3600}, # Hourly aggregation for long ranges
                    "per_series_aligner": aligner,
                }
                
            results = self.monitoring_client.list_time_series(request=req)
            
            data = []
            for result in results:
                for point in result.points:
                    dt = datetime.fromtimestamp(point.interval.start_time.timestamp(), tz=timezone.utc)
                    
                    val = 0.0
                    if point.value.double_value:
                        val = point.value.double_value
                    elif point.value.int64_value:
                        val = float(point.value.int64_value)
                    elif point.value.distribution_value:
                        # Simple distribution mean fallback if distribution
                        val = point.value.distribution_value.mean
                        
                    data.append({
                        "timestamp": dt,
                        "value": val
                    })
            return sorted(data, key=lambda x: x["timestamp"])

        # Fetch metrics
        # For distribution metrics like latency, an aligner is needed to extract percentiles
        request_rate = fetch_metric("run.googleapis.com/request_count", monitoring_v3.Aggregation.Aligner.ALIGN_RATE)
        
        latency_p50 = fetch_metric("run.googleapis.com/request_latencies", monitoring_v3.Aggregation.Aligner.ALIGN_PERCENTILE_50)
        latency_p99 = fetch_metric("run.googleapis.com/request_latencies", monitoring_v3.Aggregation.Aligner.ALIGN_PERCENTILE_99)

        return {
            "service_name": service_name,
            "request_rate": request_rate,
            "latency_p50": latency_p50,
            "latency_p99": latency_p99
        }

    async def get_service_logs(self, service_name: str, limit: int = 20) -> List[Dict[str, Any]]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._get_service_logs_sync, service_name, limit)

    def _get_service_logs_sync(self, service_name: str, limit: int) -> List[Dict[str, Any]]:
        if not self.project_id:
            raise ValueError("GCP_PROJECT_ID is not configured")

        client = self.logging_client
        # Filter for Cloud Run service logs
        filter_str = f'resource.type="cloud_run_revision" AND resource.labels.service_name="{service_name}"'
        
        entries = client.list_entries(filter_=filter_str, order_by=cloud_logging.DESCENDING, max_results=limit)
        
        logs = []
        for entry in entries:
            # We want textPayload but cloud run sometimes uses jsonPayload
            payload = ""
            if entry.payload:
                if isinstance(entry.payload, dict):
                    payload = str(entry.payload)
                else:
                    payload = entry.payload

            logs.append({
                "timestamp": entry.timestamp.isoformat() if entry.timestamp else "",
                "severity": entry.severity,
                "textPayload": payload,
                "resource": entry.resource.labels if entry.resource else {}
            })
            
        return logs

cloudrun_service = CloudRunServiceService()
