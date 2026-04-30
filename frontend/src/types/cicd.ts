export interface Build {
  id: string;
  triggerName: string;
  branch: string;
  status: 'SUCCESS' | 'FAILURE' | 'WORKING' | 'QUEUED' | 'CANCELLED';
  startTime: string;
  duration: string;
  stepsCompleted: number;
  totalSteps: number;
  logUrl: string;
}
