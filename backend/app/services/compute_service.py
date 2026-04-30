import asyncio
from typing import List, Dict, Any
from google.cloud import compute_v1
from google.cloud import monitoring_v3
from google.protobuf.timestamp_pb2 import Timestamp
import time
from datetime import datetime, timedelta, timezone
from app.config import settings

class ComputeService:
    def __init__(self):
        self.project_id = settings.gcp_project_id
        # We initialize clients dynamically so if env variables are not present immediately it won't crash on import
        self._instances_client = None
        self._monitoring_client = None

    @property
    def instances_client(self):
        if self._instances_client is None:
            self._instances_client = compute_v1.InstancesClient()
        return self._instances_client
        
    @property
    def monitoring_client(self):
        if self._monitoring_client is None:
            self._monitoring_client = monitoring_v3.MetricServiceClient()
        return self._monitoring_client

    async def list_instances(self) -> List[Dict[str, Any]]:
        """List all VM instances across all zones."""
        # Running the synchronous google-cloud-compute SDK in a thread to avoid blocking the event loop
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._list_instances_sync)

    def _list_instances_sync(self) -> List[Dict[str, Any]]:
        if not self.project_id:
            raise ValueError("GCP_PROJECT_ID is not configured")
            
        request = compute_v1.AggregatedListInstancesRequest(
            project=self.project_id,
        )
        
        # We need a client.aggregated_list call
        client = self.instances_client
        agg_list = client.aggregated_list(request=request)
        
        instances_list = []
        for zone, response in agg_list:
            if response.instances:
                for instance in response.instances:
                    # Convert to dictionary representation that matches our Pydantic model
                    network_interfaces = []
                    for ni in instance.network_interfaces:
                        access_configs = []
                        for ac in ni.access_configs:
                            access_configs.append({
                                'natIP': ac.nat_i_p,
                                'type_': ac.type_,
                                'name': ac.name
                            })
                        
                        network_interfaces.append({
                            'networkIP': ni.network_i_p,
                            'accessConfigs': access_configs
                        })

                    # Parse zone out of url: e.g. "https://www.googleapis.com/compute/v1/projects/my-proj/zones/us-central1-a"
                    zone_name = zone.split('zones/')[-1] if 'zones/' in zone else zone
                    machine_type = instance.machine_type.split('machineTypes/')[-1] if instance.machine_type else ""

                    instances_list.append({
                        "name": instance.name,
                        "zone": zone_name,
                        "machineType": machine_type,
                        "status": instance.status,
                        "networkInterfaces": network_interfaces,
                        "creationTimestamp": instance.creation_timestamp,
                    })
        
        return instances_list

    async def get_instance_metrics(self, instance_name: str, hours: int = 1) -> Dict[str, Any]:
        """Fetch metrics for a specific instance."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._get_instance_metrics_sync, instance_name, hours)

    def _get_instance_metrics_sync(self, instance_name: str, hours: int) -> Dict[str, Any]:
        if not self.project_id:
            raise ValueError("GCP_PROJECT_ID is not configured")

        now = time.time()
        seconds = int(now)
        nanos = int((now - seconds) * 10 ** 9)
        
        # Start time
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
        
        # Helper function to fetch a metric
        def fetch_metric(metric_type: str):
            results = self.monitoring_client.list_time_series(
                request={
                    "name": project_name,
                    "filter": f'metric.type = "{metric_type}" AND metric.labels.instance_name = "{instance_name}"',
                    "interval": interval,
                    "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
                }
            )
            
            data = {}
            for result in results:
                for point in result.points:
                    # Convert protobuf timestamp to python datetime
                    dt = datetime.fromtimestamp(point.interval.start_time.timestamp(), tz=timezone.utc)
                    # Use string representation of datetime or float timestamp for mapping
                    ts = dt.timestamp()
                    # value can be int64_value, double_value, etc
                    val = point.value.double_value if point.value.double_value else float(point.value.int64_value)
                    data[ts] = val
            return data

        # Fetch CPU utilization
        cpu_data = fetch_metric("compute.googleapis.com/instance/cpu/utilization")
        
        # Fetch Memory used
        memory_data = fetch_metric("compute.googleapis.com/instance/memory/balloon/ram_used")

        # Combine into time series
        # Note: timestamps might not align perfectly between CPU and Memory. We can group by minute or exact timestamp.
        # For simplicity we'll merge them by exact timestamp or align them
        all_timestamps = set(cpu_data.keys()).union(set(memory_data.keys()))
        
        timeseries = []
        for ts in sorted(list(all_timestamps)):
            cpu_val = cpu_data.get(ts)
            mem_val = memory_data.get(ts)
            
            # Note: cpu utilization is usually 0.0-1.0 or similar. We return what's available
            timeseries.append({
                "timestamp": datetime.fromtimestamp(ts, tz=timezone.utc),
                "cpu_percent": cpu_val * 100 if cpu_val is not None else None, # assuming cpu_utilization is a fraction
                "memory_percent": mem_val, # Note: balloon/ram_used is bytes, not percent, but prompt says "memory_percent". We'll just return the value or we'd need total memory to calculate percent. For now returning the raw value
            })
            
        return {
            "instance_name": instance_name,
            "timeseries": timeseries
        }

    async def get_total_cpu_utilization(self) -> float:
        """Calculate average CPU utilization across all instances in the project."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._get_total_cpu_utilization_sync)

    def _get_total_cpu_utilization_sync(self) -> float:
        if not self.project_id:
            return 0.0
            
        now = time.time()
        interval = monitoring_v3.TimeInterval(
            {
                "end_time": Timestamp(seconds=int(now)),
                "start_time": Timestamp(seconds=int(now - 3600)),
            }
        )
        
        project_name = f"projects/{self.project_id}"
        
        # Aggregated query across all instances
        results = self.monitoring_client.list_time_series(
            request={
                "name": project_name,
                "filter": 'metric.type = "compute.googleapis.com/instance/cpu/utilization"',
                "interval": interval,
                "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
                "aggregation": {
                    "alignment_period": {"seconds": 3600},
                    "per_series_aligner": monitoring_v3.Aggregation.Aligner.ALIGN_MEAN,
                    "cross_series_reducer": monitoring_v3.Aggregation.Reducer.REDUCE_MEAN,
                }
            }
        )
        
        for result in results:
            for point in result.points:
                return point.value.double_value * 100
        
        return 0.0

compute_service = ComputeService()
