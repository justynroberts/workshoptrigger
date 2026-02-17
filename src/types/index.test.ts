// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect } from 'vitest';
import type { Severity, K8sError, TriggerHistoryItem, PagerDutyPayload, PagerDutyResponse, Theme } from './index';

describe('types', () => {
  it('should export Severity type', () => {
    const severity: Severity = 'critical';
    expect(['critical', 'error', 'warning', 'info']).toContain(severity);
  });

  it('should export K8sError type', () => {
    const error: K8sError = {
      id: 'test',
      name: 'Test Error',
      severity: 'critical',
      description: 'Test description',
      component: 'pod',
      errorClass: 'TestClass',
    };
    expect(error.id).toBe('test');
  });

  it('should export TriggerHistoryItem type', () => {
    const item: TriggerHistoryItem = {
      id: '123',
      errorType: 'TestError',
      timestamp: new Date(),
      status: 'success',
    };
    expect(item.status).toBe('success');
  });

  it('should export TriggerHistoryItem with optional fields', () => {
    const item: TriggerHistoryItem = {
      id: '123',
      errorType: 'TestError',
      timestamp: new Date(),
      status: 'failed',
      dedupKey: 'dedup-123',
      errorMessage: 'Failed to connect',
    };
    expect(item.dedupKey).toBe('dedup-123');
  });

  it('should export PagerDutyPayload type', () => {
    const payload: PagerDutyPayload = {
      routing_key: 'test-key',
      event_action: 'trigger',
      dedup_key: 'dedup-123',
      payload: {
        summary: 'Test summary',
        source: 'test-source',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        component: 'pod',
        group: 'kubernetes',
        class: 'TestClass',
        custom_details: { key: 'value' },
      },
    };
    expect(payload.event_action).toBe('trigger');
  });

  it('should export PagerDutyResponse type', () => {
    const response: PagerDutyResponse = {
      status: 'success',
      message: 'Event processed',
      dedup_key: 'dedup-123',
    };
    expect(response.status).toBe('success');
  });

  it('should export Theme type', () => {
    const theme: Theme = 'dark';
    expect(['dark', 'light']).toContain(theme);
  });
});
