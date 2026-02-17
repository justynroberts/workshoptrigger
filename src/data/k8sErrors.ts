// MIT License - Copyright (c) fintonlabs.com

import { K8sError } from '../types';

export const k8sErrors: K8sError[] = [
  {
    id: 'crash-loop',
    name: 'Pod CrashLoopBackOff',
    severity: 'critical',
    description: 'Container repeatedly crashing and restarting',
    component: 'pod',
    errorClass: 'CrashLoopBackOff',
  },
  {
    id: 'node-not-ready',
    name: 'Node NotReady',
    severity: 'critical',
    description: 'Kubernetes node has stopped responding',
    component: 'node',
    errorClass: 'NotReady',
  },
  {
    id: 'oom-killed',
    name: 'OOMKilled',
    severity: 'critical',
    description: 'Container exceeded memory limits',
    component: 'container',
    errorClass: 'OOMKilled',
  },
  {
    id: 'image-pull',
    name: 'ImagePullBackOff',
    severity: 'warning',
    description: 'Failed to pull container image',
    component: 'pod',
    errorClass: 'ImagePullBackOff',
  },
  {
    id: 'pvc-pending',
    name: 'PVC Pending',
    severity: 'warning',
    description: 'Storage volume cannot be provisioned',
    component: 'pvc',
    errorClass: 'Pending',
  },
  {
    id: 'endpoint-not-ready',
    name: 'Service Endpoint NotReady',
    severity: 'error',
    description: 'Service has no available endpoints',
    component: 'service',
    errorClass: 'EndpointNotReady',
  },
  {
    id: 'rollout-failed',
    name: 'Deployment Rollout Failed',
    severity: 'error',
    description: 'Deployment update failed to complete',
    component: 'deployment',
    errorClass: 'ProgressDeadlineExceeded',
  },
  {
    id: 'hpa-max',
    name: 'HPA Max Replicas',
    severity: 'warning',
    description: 'Horizontal Pod Autoscaler at maximum capacity',
    component: 'hpa',
    errorClass: 'ScalingLimited',
  },
];
