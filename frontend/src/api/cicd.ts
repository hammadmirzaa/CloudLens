import type { Build } from '../types/cicd';

export const fetchBuilds = async (): Promise<Build[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    { id: 'b-a1b2c3d', triggerName: 'deploy-production', branch: 'main', status: 'WORKING', startTime: new Date(Date.now() - 2 * 60000).toISOString(), duration: '-', stepsCompleted: 3, totalSteps: 5, logUrl: '#' },
    { id: 'b-e4f5g6h', triggerName: 'pr-checks', branch: 'feature/auth-refresh', status: 'SUCCESS', startTime: new Date(Date.now() - 45 * 60000).toISOString(), duration: '4m 12s', stepsCompleted: 4, totalSteps: 4, logUrl: '#' },
    { id: 'b-i7j8k9l', triggerName: 'deploy-staging', branch: 'develop', status: 'FAILURE', startTime: new Date(Date.now() - 120 * 60000).toISOString(), duration: '1m 45s', stepsCompleted: 2, totalSteps: 6, logUrl: '#' },
    { id: 'b-m1n2o3p', triggerName: 'pr-checks', branch: 'bugfix/payment-gateway', status: 'SUCCESS', startTime: new Date(Date.now() - 180 * 60000).toISOString(), duration: '3m 50s', stepsCompleted: 4, totalSteps: 4, logUrl: '#' },
    { id: 'b-q4r5s6t', triggerName: 'nightly-tests', branch: 'main', status: 'CANCELLED', startTime: new Date(Date.now() - 720 * 60000).toISOString(), duration: '0m 30s', stepsCompleted: 1, totalSteps: 8, logUrl: '#' },
    { id: 'b-u7v8w9x', triggerName: 'deploy-production', branch: 'main', status: 'QUEUED', startTime: new Date(Date.now() - 1 * 60000).toISOString(), duration: '-', stepsCompleted: 0, totalSteps: 5, logUrl: '#' },
  ];
};
