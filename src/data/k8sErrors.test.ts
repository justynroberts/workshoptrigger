// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect } from 'vitest';
import { k8sErrors } from './k8sErrors';

describe('k8sErrors data', () => {
  it('should have 8 error types', () => {
    expect(k8sErrors).toHaveLength(8);
  });

  it('should have unique IDs', () => {
    const ids = k8sErrors.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have all required fields', () => {
    k8sErrors.forEach((error) => {
      expect(error.id).toBeDefined();
      expect(error.name).toBeDefined();
      expect(error.severity).toBeDefined();
      expect(error.description).toBeDefined();
      expect(error.component).toBeDefined();
      expect(error.errorClass).toBeDefined();
    });
  });

  it('should have valid severity values', () => {
    const validSeverities = ['critical', 'error', 'warning', 'info'];
    k8sErrors.forEach((error) => {
      expect(validSeverities).toContain(error.severity);
    });
  });

  it('should include CrashLoopBackOff error', () => {
    const crashLoop = k8sErrors.find((e) => e.id === 'crash-loop');
    expect(crashLoop).toBeDefined();
    expect(crashLoop?.severity).toBe('critical');
  });

  it('should include Node NotReady error', () => {
    const nodeNotReady = k8sErrors.find((e) => e.id === 'node-not-ready');
    expect(nodeNotReady).toBeDefined();
    expect(nodeNotReady?.severity).toBe('critical');
  });

  it('should include OOMKilled error', () => {
    const oomKilled = k8sErrors.find((e) => e.id === 'oom-killed');
    expect(oomKilled).toBeDefined();
    expect(oomKilled?.severity).toBe('critical');
  });

  it('should include ImagePullBackOff error', () => {
    const imagePull = k8sErrors.find((e) => e.id === 'image-pull');
    expect(imagePull).toBeDefined();
    expect(imagePull?.severity).toBe('warning');
  });

  it('should include PVC Pending error', () => {
    const pvcPending = k8sErrors.find((e) => e.id === 'pvc-pending');
    expect(pvcPending).toBeDefined();
    expect(pvcPending?.severity).toBe('warning');
  });

  it('should include Service Endpoint NotReady error', () => {
    const endpoint = k8sErrors.find((e) => e.id === 'endpoint-not-ready');
    expect(endpoint).toBeDefined();
    expect(endpoint?.severity).toBe('error');
  });

  it('should include Deployment Rollout Failed error', () => {
    const rollout = k8sErrors.find((e) => e.id === 'rollout-failed');
    expect(rollout).toBeDefined();
    expect(rollout?.severity).toBe('error');
  });

  it('should include HPA Max Replicas error', () => {
    const hpa = k8sErrors.find((e) => e.id === 'hpa-max');
    expect(hpa).toBeDefined();
    expect(hpa?.severity).toBe('warning');
  });
});
