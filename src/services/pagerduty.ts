// MIT License - Copyright (c) fintonlabs.com

import { K8sError, PagerDutyPayload, PagerDutyResponse, Severity } from '../types';

const PAGERDUTY_EVENTS_URL = 'https://events.pagerduty.com/v2/enqueue';

function generateDedupKey(): string {
  return `workshop-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function generatePodName(component: string): string {
  const suffix = Math.random().toString(36).substring(2, 7);
  const names: Record<string, string> = {
    pod: `api-server-7d4f8c9b5-${suffix}`,
    node: `worker-node-${suffix}`,
    container: `web-app-${suffix}`,
    pvc: `data-volume-${suffix}`,
    service: `backend-svc-${suffix}`,
    deployment: `frontend-deploy-${suffix}`,
    hpa: `autoscaler-${suffix}`,
  };
  return names[component] || `resource-${suffix}`;
}

function generateCustomDetails(error: K8sError): Record<string, string | number> {
  const baseDetails = {
    namespace: 'production',
    cluster: 'workshop-cluster',
    region: 'us-east-1',
  };

  const specificDetails: Record<string, Record<string, string | number>> = {
    'crash-loop': {
      pod_name: generatePodName('pod'),
      container: 'api-server',
      restart_count: Math.floor(Math.random() * 10) + 5,
      last_state: 'Error',
      exit_code: 1,
    },
    'node-not-ready': {
      node_name: generatePodName('node'),
      condition: 'NotReady',
      last_heartbeat: new Date(Date.now() - 300000).toISOString(),
      kubelet_status: 'Unknown',
    },
    'oom-killed': {
      pod_name: generatePodName('pod'),
      container: 'worker',
      memory_limit: '512Mi',
      memory_usage: '548Mi',
      exit_code: 137,
    },
    'image-pull': {
      pod_name: generatePodName('pod'),
      image: 'registry.example.com/app:v2.1.0',
      reason: 'ImagePullBackOff',
      message: 'Failed to pull image: unauthorized',
    },
    'pvc-pending': {
      pvc_name: generatePodName('pvc'),
      storage_class: 'gp3',
      requested_size: '100Gi',
      reason: 'ProvisioningFailed',
    },
    'endpoint-not-ready': {
      service_name: generatePodName('service'),
      port: 8080,
      ready_endpoints: 0,
      total_endpoints: 3,
    },
    'rollout-failed': {
      deployment_name: generatePodName('deployment'),
      replicas_desired: 5,
      replicas_available: 2,
      reason: 'ProgressDeadlineExceeded',
    },
    'hpa-max': {
      hpa_name: generatePodName('hpa'),
      min_replicas: 2,
      max_replicas: 10,
      current_replicas: 10,
      cpu_utilization: '95%',
    },
  };

  return { ...baseDetails, ...specificDetails[error.id] };
}

export function buildPayload(routingKey: string, error: K8sError): PagerDutyPayload {
  const dedupKey = generateDedupKey();
  const customDetails = generateCustomDetails(error);
  const resourceName = customDetails.pod_name || customDetails.node_name ||
                       customDetails.pvc_name || customDetails.service_name ||
                       customDetails.deployment_name || customDetails.hpa_name || 'resource';

  return {
    routing_key: routingKey,
    event_action: 'trigger',
    dedup_key: dedupKey,
    payload: {
      summary: `[K8s] ${error.name} in namespace production - ${resourceName}`,
      source: `kubernetes:workshop-cluster:production:${error.component}/${resourceName}`,
      severity: error.severity as Severity,
      timestamp: new Date().toISOString(),
      component: error.component,
      group: 'kubernetes',
      class: error.errorClass,
      custom_details: customDetails,
    },
  };
}

export async function triggerIncident(
  routingKey: string,
  error: K8sError
): Promise<PagerDutyResponse> {
  const payload = buildPayload(routingKey, error);

  const response = await fetch(PAGERDUTY_EVENTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PagerDuty API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
