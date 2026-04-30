from google.cloud.devtools import cloudbuild_v1
from app.config import settings
from app.models.cicd import BuildInfo, BuildStep, TriggerInfo
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

class CICDService:
    def __init__(self):
        self.client = cloudbuild_v1.CloudBuildAsyncClient()
        self.project_id = settings.gcp_project_id

    def _map_status(self, status: cloudbuild_v1.Build.Status) -> str:
        status_map = {
            cloudbuild_v1.Build.Status.STATUS_UNKNOWN: "UNKNOWN",
            cloudbuild_v1.Build.Status.QUEUED: "QUEUED",
            cloudbuild_v1.Build.Status.WORKING: "WORKING",
            cloudbuild_v1.Build.Status.SUCCESS: "SUCCESS",
            cloudbuild_v1.Build.Status.FAILURE: "FAILURE",
            cloudbuild_v1.Build.Status.INTERNAL_ERROR: "INTERNAL_ERROR",
            cloudbuild_v1.Build.Status.TIMEOUT: "TIMEOUT",
            cloudbuild_v1.Build.Status.CANCELLED: "CANCELLED",
            cloudbuild_v1.Build.Status.EXPIRED: "EXPIRED",
        }
        return status_map.get(status, "UNKNOWN")

    async def list_builds(
        self, 
        status: Optional[str] = None, 
        trigger_id: Optional[str] = None, 
        limit: int = 20
    ) -> List[BuildInfo]:
        try:
            request = cloudbuild_v1.ListBuildsRequest(
                project_id=self.project_id,
                page_size=limit,
            )
            
            # Note: filtering in ListBuilds is limited, we might need to filter manually if status or trigger_id is provided
            # or use the filter field if supported by the API.
            if status or trigger_id:
                filter_parts = []
                if status:
                    filter_parts.append(f'status="{status}"')
                if trigger_id:
                    filter_parts.append(f'build_trigger_id="{trigger_id}"')
                request.filter = " AND ".join(filter_parts)

            response = await self.client.list_builds(request=request)
            
            builds = []
            async for build in response:
                duration = None
                if build.start_time and build.finish_time:
                    duration = (build.finish_time - build.start_time).total_seconds()
                
                steps = [
                    BuildStep(name=step.name, status=self._map_status(step.status))
                    for step in build.steps
                ]
                
                builds.append(BuildInfo(
                    id=build.id,
                    status=self._map_status(build.status),
                    triggerName=build.substitutions.get("TRIGGER_NAME"),
                    branchName=build.substitutions.get("BRANCH_NAME"),
                    tagName=build.substitutions.get("TAG_NAME"),
                    startTime=build.start_time,
                    finishTime=build.finish_time,
                    duration_seconds=duration,
                    steps=steps,
                    logUrl=build.log_url,
                    substitutions=dict(build.substitutions)
                ))
            
            return builds
        except Exception as e:
            logger.error(f"Error fetching builds: {str(e)}")
            return []

    async def list_triggers(self) -> List[TriggerInfo]:
        try:
            request = cloudbuild_v1.ListBuildTriggersRequest(
                project_id=self.project_id
            )
            response = await self.client.list_build_triggers(request=request)
            
            triggers = []
            async for trigger in response:
                github_repo = None
                if hasattr(trigger, 'github') and trigger.github:
                    github_repo = f"{trigger.github.owner}/{trigger.github.name}"
                
                triggers.append(TriggerInfo(
                    id=trigger.id,
                    name=trigger.name,
                    description=trigger.description,
                    github_repo=github_repo
                ))
            
            return triggers
        except Exception as e:
            logger.error(f"Error fetching triggers: {str(e)}")
            return []
