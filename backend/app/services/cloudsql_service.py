import asyncio
from typing import List, Dict, Any
from googleapiclient import discovery
from google.auth import default
from google.cloud import monitoring_v3
from google.cloud import logging as cloud_logging
from google.protobuf.timestamp_pb2 import Timestamp
import time
from datetime import datetime, timezone
from app.config import settings

class CloudSQLService:
    def __init__(self):
        self.project_id = settings.gcp_project_id
        self._sql_client = None
        self._monitoring_client = None
        self._logging_client = None

    @property
    def sql_client(self):
        if self._sql_client is None:
            credentials, _ = default()
            self._sql_client = discovery.build('sqladmin', 'v1', credentials=credentials)
        return self._sql_client

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

    async def list_instances(self) -> List[Dict[str, Any]]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._list_instances_sync)

    def _list_instances_sync(self) -> List[Dict[str, Any]]:
        if not self.project_id:
            raise ValueError("GCP_PROJECT_ID is not configured")
            
        request = self.sql_client.instances().list(project=self.project_id)
        response = request.execute()
        
        instances_list = []
        for instance in response.get('items', []):
            instances_list.append({
                "name": instance.get('name'),
                "region": instance.get('region'),
                "databaseVersion": instance.get('databaseVersion'),
                "state": instance.get('state'),
                "ipAddresses": instance.get('ipAddresses', [])
            })
            
        return instances_list

    async def get_instance_metrics(self, instance_name: str, hours: int = 24) -> Dict[str, Any]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._get_instance_metrics_sync, instance_name, hours)

    def _get_instance_metrics_sync(self, instance_name: str, hours: int) -> Dict[str, Any]:
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
        
        def fetch_metric(metric_type: str, aligner):
            req = {
                "name": project_name,
                "filter": f'metric.type = "{metric_type}" AND resource.labels.database_id = "{self.project_id}:{instance_name}"',
                "interval": interval,
                "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
                "aggregation": {
                    "alignment_period": {"seconds": 3600}, # Hourly
                    "per_series_aligner": aligner,
                }
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
                        
                    data.append({
                        "timestamp": dt,
                        "value": val
                    })
            return sorted(data, key=lambda x: x["timestamp"])

        cpu_utilization = fetch_metric("cloudsql.googleapis.com/database/cpu/utilization", monitoring_v3.Aggregation.Aligner.ALIGN_MEAN)
        memory_utilization = fetch_metric("cloudsql.googleapis.com/database/memory/utilization", monitoring_v3.Aggregation.Aligner.ALIGN_MEAN)

        return {
            "instance_name": instance_name,
            "cpu_utilization": cpu_utilization,
            "memory_utilization": memory_utilization
        }

    async def get_instance_logs(self, instance_name: str, limit: int = 20) -> List[Dict[str, Any]]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._get_instance_logs_sync, instance_name, limit)

    def _get_instance_logs_sync(self, instance_name: str, limit: int) -> List[Dict[str, Any]]:
        if not self.project_id:
            raise ValueError("GCP_PROJECT_ID is not configured")

        client = self.logging_client
        filter_str = f'resource.type="cloudsql_database" AND resource.labels.database_id="{self.project_id}:{instance_name}"'
        
        entries = client.list_entries(filter_=filter_str, order_by=cloud_logging.DESCENDING, max_results=limit)
        
        logs = []
        for entry in entries:
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

cloudsql_service = CloudSQLService()
