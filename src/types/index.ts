// MIT License - Copyright (c) fintonlabs.com

export type Severity = 'critical' | 'error' | 'warning' | 'info';

export interface K8sError {
  id: string;
  name: string;
  severity: Severity;
  description: string;
  component: string;
  errorClass: string;
}

export interface TriggerHistoryItem {
  id: string;
  errorType: string;
  timestamp: Date;
  status: 'success' | 'failed';
  dedupKey?: string;
  errorMessage?: string;
}

export interface PagerDutyPayload {
  routing_key: string;
  event_action: 'trigger';
  dedup_key: string;
  payload: {
    summary: string;
    source: string;
    severity: Severity;
    timestamp: string;
    component: string;
    group: string;
    class: string;
    custom_details: Record<string, string | number>;
  };
}

export interface PagerDutyResponse {
  status: string;
  message: string;
  dedup_key: string;
}

export type Theme = 'dark' | 'light';
