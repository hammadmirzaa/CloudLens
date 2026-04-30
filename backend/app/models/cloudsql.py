from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class CloudSQLInstance(BaseModel):
    name: str
    region: str
    databaseVersion: str
    state: str
    ipAddresses: List[Dict[str, str]]

class MetricDataPoint(BaseModel):
    timestamp: datetime
    value: float

class CloudSQLMetrics(BaseModel):
    instance_name: str
    cpu_utilization: List[MetricDataPoint]
    memory_utilization: List[MetricDataPoint]

class CloudSQLLogEntry(BaseModel):
    timestamp: str
    severity: str
    textPayload: str
    resource: Dict[str, Any]
