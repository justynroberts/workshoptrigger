// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildPayload, triggerIncident } from './pagerduty';
import { K8sError } from '../types';

const mockErrors: K8sError[] = [
  {
    id: 'crash-loop',
    name: 'Pod CrashLoopBackOff',
    severity: 'critical',
    description: 'Container repeatedly crashing',
    component: 'pod',
    errorClass: 'CrashLoopBackOff',
  },
  {
    id: 'node-not-ready',
    name: 'Node NotReady',
    severity: 'critical',
    description: 'Node not responding',
    component: 'node',
    errorClass: 'NotReady',
  },
  {
    id: 'oom-killed',
    name: 'OOMKilled',
    severity: 'critical',
    description: 'Memory exceeded',
    component: 'container',
    errorClass: 'OOMKilled',
  },
  {
    id: 'image-pull',
    name: 'ImagePullBackOff',
    severity: 'warning',
    description: 'Failed to pull image',
    component: 'pod',
    errorClass: 'ImagePullBackOff',
  },
  {
    id: 'pvc-pending',
    name: 'PVC Pending',
    severity: 'warning',
    description: 'Storage pending',
    component: 'pvc',
    errorClass: 'Pending',
  },
  {
    id: 'endpoint-not-ready',
    name: 'Service Endpoint NotReady',
    severity: 'error',
    description: 'No endpoints',
    component: 'service',
    errorClass: 'EndpointNotReady',
  },
  {
    id: 'rollout-failed',
    name: 'Deployment Rollout Failed',
    severity: 'error',
    description: 'Rollout failed',
    component: 'deployment',
    errorClass: 'ProgressDeadlineExceeded',
  },
  {
    id: 'hpa-max',
    name: 'HPA Max Replicas',
    severity: 'warning',
    description: 'At max capacity',
    component: 'hpa',
    errorClass: 'ScalingLimited',
  },
];

describe('pagerduty service', () => {
  describe('buildPayload', () => {
    it('should build valid payload with routing key', () => {
      const payload = buildPayload('test-routing-key', mockErrors[0]);

      expect(payload.routing_key).toBe('test-routing-key');
      expect(payload.event_action).toBe('trigger');
      expect(payload.dedup_key).toMatch(/^workshop-\d+-[a-z0-9]+$/);
    });

    it('should include proper payload structure', () => {
      const payload = buildPayload('key', mockErrors[0]);

      expect(payload.payload.summary).toContain('[K8s]');
      expect(payload.payload.summary).toContain('CrashLoopBackOff');
      expect(payload.payload.severity).toBe('critical');
      expect(payload.payload.component).toBe('pod');
      expect(payload.payload.group).toBe('kubernetes');
      expect(payload.payload.class).toBe('CrashLoopBackOff');
    });

    it('should generate unique dedup keys', () => {
      const payload1 = buildPayload('key', mockErrors[0]);
      const payload2 = buildPayload('key', mockErrors[0]);

      expect(payload1.dedup_key).not.toBe(payload2.dedup_key);
    });

    it('should include timestamp in ISO format', () => {
      const payload = buildPayload('key', mockErrors[0]);
      const timestamp = new Date(payload.payload.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(isNaN(timestamp.getTime())).toBe(false);
    });

    it('should include source with kubernetes prefix', () => {
      const payload = buildPayload('key', mockErrors[0]);

      expect(payload.payload.source).toMatch(/^kubernetes:workshop-cluster:/);
    });

    it.each(mockErrors)('should build payload for $id error', (error) => {
      const payload = buildPayload('test-key', error);

      expect(payload.routing_key).toBe('test-key');
      expect(payload.payload.severity).toBe(error.severity);
      expect(payload.payload.component).toBe(error.component);
      expect(payload.payload.class).toBe(error.errorClass);
      expect(payload.payload.custom_details).toBeDefined();
      expect(payload.payload.custom_details.namespace).toBe('production');
      expect(payload.payload.custom_details.cluster).toBe('workshop-cluster');
      expect(payload.payload.custom_details.service).toBe('payment');
    });

    it('should handle unknown component type', () => {
      const unknownError: K8sError = {
        id: 'unknown',
        name: 'Unknown Error',
        severity: 'info',
        description: 'Unknown',
        component: 'unknown',
        errorClass: 'Unknown',
      };

      const payload = buildPayload('key', unknownError);

      expect(payload.payload.source).toContain('unknown/resource');
    });
  });

  describe('triggerIncident', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should send POST request to PagerDuty API', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ status: 'success', dedup_key: 'abc123', message: 'Event processed' }),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      await triggerIncident('test-key', mockErrors[0]);

      expect(fetch).toHaveBeenCalledWith(
        'https://events.pagerduty.com/v2/enqueue',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should return response data on success', async () => {
      const mockResponseData = { status: 'success', dedup_key: 'xyz789', message: 'Event processed' };
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponseData),
      } as Response);

      const result = await triggerIncident('test-key', mockErrors[0]);

      expect(result).toEqual(mockResponseData);
    });

    it('should throw error on API failure', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Bad Request'),
      } as Response);

      await expect(triggerIncident('test-key', mockErrors[0])).rejects.toThrow(
        'PagerDuty API error: 400 - Bad Request'
      );
    });

    it('should include routing key in payload', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 'success', dedup_key: 'test', message: 'ok' }),
      } as Response);

      await triggerIncident('my-routing-key-123', mockErrors[0]);

      const callArg = vi.mocked(fetch).mock.calls[0][1];
      const body = JSON.parse(callArg?.body as string);

      expect(body.routing_key).toBe('my-routing-key-123');
    });
  });
});
