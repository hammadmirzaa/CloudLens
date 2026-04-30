from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class CloudRunService(BaseModel):
    name: str
    region: str
    uri: str
    latestRevision: str
    conditions: List[Dict[str, Any]]
    createTime: str
    updateTime: str

class MetricDataPoint(BaseModel):
    timestamp: datetime
    value: float

class CloudRunMetrics(BaseModel):
    service_name: str
    request_rate: List[MetricDataPoint]
    latency_p50: List[MetricDataPoint]
    latency_p99: List[MetricDataPoint]

class CloudRunLogEntry(BaseModel):
    timestamp: str
    severity: str
    textPayload: str
    resource: Dict[str, Any]
