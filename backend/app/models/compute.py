from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class NetworkInterface(BaseModel):
    networkIP: Optional[str] = None
    accessConfigs: Optional[List[dict]] = None
    
    @property
    def externalIP(self) -> Optional[str]:
        if self.accessConfigs and len(self.accessConfigs) > 0:
            return self.accessConfigs[0].get('natIP')
        return None

class ComputeInstance(BaseModel):
    name: str
    zone: str
    machineType: str
    status: str
    networkInterfaces: List[NetworkInterface]
    creationTimestamp: str
    
    @property
    def internal_ip(self) -> Optional[str]:
        if self.networkInterfaces and len(self.networkInterfaces) > 0:
            return self.networkInterfaces[0].networkIP
        return None
        
    @property
    def external_ip(self) -> Optional[str]:
        if self.networkInterfaces and len(self.networkInterfaces) > 0:
            return self.networkInterfaces[0].externalIP
        return None

class MetricDataPoint(BaseModel):
    timestamp: datetime
    cpu_percent: Optional[float] = None
    memory_percent: Optional[float] = None

class ComputeMetrics(BaseModel):
    instance_name: str
    timeseries: List[MetricDataPoint]
