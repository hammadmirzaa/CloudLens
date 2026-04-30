import asyncio
from typing import List, Dict, Any
from google.cloud import container_v1
from google.cloud import monitoring_v3
from google.cloud import logging as cloud_logging
from google.protobuf.timestamp_pb2 import Timestamp
import time
from datetime import datetime, timezone
from app.config import settings

class GKEService:
    def __init__(self):
        self.project_id = settings.gcp_project_id
        self._cluster_client = None
        self._monitoring_client = None
        self._logging_client = None

    @property
    def cluster_client(self):
        if self._cluster_client is None:
            self._cluster_client = container_v1.ClusterManagerClient()
        return self._cluster_client

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

    async def list_clusters(self) -> List[Dict[str, Any]]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._list_clusters_sync)

    def _list_clusters_sync(self) -> List[Dict[str, Any]]:
        if not self.project_id:
            raise ValueError("GCP_PROJECT_ID is not configured")
            
        request = container_v1.ListClustersRequest(
            parent=f"projects/{self.project_id}/locations/-"
        )
        
        response = self.cluster_client.list_clusters(request=request)
        
        clusters_list = []
        for cluster in response.clusters:
            clusters_list.append({
                "name": cluster.name,
                "location": cluster.location,
                "status": cluster.status.name,
                "endpoint": cluster.endpoint,
                "nodeCount": cluster.current_node_count,
                "createTime": cluster.create_time
            })
            
        return clusters_list

    async def get_cluster_metrics(self, cluster_name: str, hours: int = 24) -> Dict[str, Any]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._get_cluster_metrics_sync, cluster_name, hours)

    def _get_cluster_metrics_sync(self, cluster_name: str, hours: int) -> Dict[str, Any]:
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
                "filter": f'metric.type = "{metric_type}" AND resource.labels.cluster_name = "{cluster_name}"',
                "interval": interval,
                "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
                "aggregation": {
                    "alignment_period": {"seconds": 3600}, # Hourly
                    "per_series_aligner": aligner,
                    "cross_series_reducer": monitoring_v3.Aggregation.Reducer.REDUCE_SUM, # Aggregate across nodes
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
            # Ensure unique timestamps and aggregate properly if there are duplicates
            # (Though cross_series_reducer should return 1 timeseries)
            unique_data = {d["timestamp"]: d["value"] for d in data}
            sorted_data = [{"timestamp": k, "value": v} for k, v in sorted(unique_data.items())]
            return sorted_data

        cpu_usage = fetch_metric("kubernetes.io/node/cpu/core_usage_time", monitoring_v3.Aggregation.Aligner.ALIGN_RATE)
        memory_usage = fetch_metric("kubernetes.io/node/memory/used_bytes", monitoring_v3.Aggregation.Aligner.ALIGN_MEAN)

        return {
            "cluster_name": cluster_name,
            "cpu_usage_time": cpu_usage,
            "memory_used_bytes": memory_usage
        }

    async def get_cluster_logs(self, cluster_name: str, limit: int = 20) -> List[Dict[str, Any]]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._get_cluster_logs_sync, cluster_name, limit)

    def _get_cluster_logs_sync(self, cluster_name: str, limit: int) -> List[Dict[str, Any]]:
        if not self.project_id:
            raise ValueError("GCP_PROJECT_ID is not configured")

        client = self.logging_client
        filter_str = f'resource.type="k8s_cluster" AND resource.labels.cluster_name="{cluster_name}"'
        
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

gke_service = GKEService()
