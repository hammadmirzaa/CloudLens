from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class GKECluster(BaseModel):
    name: str
    location: str
    status: str
    endpoint: str
    nodeCount: int
    createTime: str

class MetricDataPoint(BaseModel):
    timestamp: datetime
    value: float

class GKEMetrics(BaseModel):
    cluster_name: str
    cpu_usage_time: List[MetricDataPoint]
    memory_used_bytes: List[MetricDataPoint]

class GKELogEntry(BaseModel):
    timestamp: str
    severity: str
    textPayload: str
    resource: Dict[str, Any]
