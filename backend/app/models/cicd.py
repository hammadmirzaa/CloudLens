from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class BuildStep(BaseModel):
    name: str
    status: str

class BuildInfo(BaseModel):
    id: str
    status: str
    triggerName: Optional[str] = None
    branchName: Optional[str] = None
    tagName: Optional[str] = None
    startTime: Optional[datetime] = None
    finishTime: Optional[datetime] = None
    duration_seconds: Optional[float] = None
    steps: List[BuildStep] = []
    logUrl: Optional[str] = None
    substitutions: Dict[str, str] = {}

class TriggerInfo(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    github_repo: Optional[str] = None
