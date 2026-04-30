from google.cloud import logging as cloud_logging
from app.config import settings
from app.models.logs import LogEntry, LogsResponse, ResourceInfo
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)

class LogsService:
    def __init__(self):
        self.client = cloud_logging.Client(project=settings.gcp_project_id)

    async def list_logs(
        self, 
        resource: Optional[str] = None, 
        severity: Optional[str] = None, 
        limit: int = 50, 
        page_token: Optional[str] = None
    ) -> LogsResponse:
        try:
            filters = []
            if resource:
                filters.append(f'resource.type="{resource}"')
            if severity:
                filters.append(f'severity="{severity}"')
            
            filter_str = " AND ".join(filters) if filters else ""
            
            entries_iter = self.client.list_entries(
                filter_=filter_str,
                page_size=limit,
                page_token=page_token
            )
            
            # The iterator handles pagination. To get the next page token, we need to look at the iterator's state
            # after consuming the page.
            entries = []
            page = next(entries_iter.pages)
            
            for entry in page:
                res_type = entry.resource.type if entry.resource else "unknown"
                res_name = entry.resource.labels.get("instance_id", entry.resource.labels.get("name", "unknown"))
                
                entries.append(LogEntry(
                    timestamp=entry.timestamp,
                    severity=entry.severity,
                    resource_type=res_type,
                    resource_name=res_name,
                    text_payload=entry.payload if isinstance(entry.payload, str) else None,
                    json_payload=entry.payload if isinstance(entry.payload, dict) else None,
                    insert_id=entry.insert_id
                ))
            
            return LogsResponse(
                entries=entries,
                nextPageToken=entries_iter.next_page_token
            )
        except Exception as e:
            logger.error(f"Error fetching logs: {str(e)}")
            raise e

    async def list_resources(self) -> List[ResourceInfo]:
        try:
            # We can use descriptors or fetch recent entries to find unique resources.
            # Descriptors provide the types, but not specific names.
            # Let's use descriptors to get types.
            descriptors = self.client.list_resource_descriptors()
            resources = [ResourceInfo(type=d.type) for d in descriptors]
            return resources
        except Exception as e:
            logger.error(f"Error fetching log resources: {str(e)}")
            return []

logs_service = LogsService()
