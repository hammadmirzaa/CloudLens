export interface LogEntry {
  id: string;
  timestamp: string;
  severity: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  resource: string;
  message: string;
}

export interface LogsResponse {
  logs: LogEntry[];
  nextPageToken: string | null;
}
