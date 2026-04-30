from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class LogEntry(BaseModel):
    timestamp: datetime
    severity: str
    resource_type: str
    resource_name: str
    text_payload: Optional[str] = None
    json_payload: Optional[Dict[str, Any]] = None
    insert_id: str

class LogsResponse(BaseModel):
    entries: List[LogEntry]
    nextPageToken: Optional[str] = None

class ResourceInfo(BaseModel):
    type: str
    name: Optional[str] = None

class LogResourcesResponse(BaseModel):
    resources: List[ResourceInfo]
