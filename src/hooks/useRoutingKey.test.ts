// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRoutingKey } from './useRoutingKey';

describe('useRoutingKey hook', () => {
  it('should return null initially when no key stored', () => {
    vi.spyOn(sessionStorage, 'getItem').mockReturnValue(null);

    const { result } = renderHook(() => useRoutingKey());

    expect(result.current.routingKey).toBeNull();
    expect(result.current.isConfigured).toBe(false);
  });

  it('should return stored key on initial render', () => {
    vi.spyOn(sessionStorage, 'getItem').mockReturnValue('stored-key');

    const { result } = renderHook(() => useRoutingKey());

    expect(result.current.routingKey).toBe('stored-key');
    expect(result.current.isConfigured).toBe(true);
  });

  it('should update routing key when setRoutingKey called', () => {
    vi.spyOn(sessionStorage, 'getItem').mockReturnValue(null);

    const { result } = renderHook(() => useRoutingKey());

    act(() => {
      result.current.setRoutingKey('new-key-123');
    });

    expect(result.current.routingKey).toBe('new-key-123');
    expect(result.current.isConfigured).toBe(true);
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'pagerduty_routing_key',
      'new-key-123'
    );
  });

  it('should clear routing key when clearRoutingKey called', () => {
    vi.spyOn(sessionStorage, 'getItem').mockReturnValue('existing-key');

    const { result } = renderHook(() => useRoutingKey());

    act(() => {
      result.current.clearRoutingKey();
    });

    expect(result.current.routingKey).toBeNull();
    expect(result.current.isConfigured).toBe(false);
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('pagerduty_routing_key');
  });

  it('should report isConfigured false for empty string', () => {
    vi.spyOn(sessionStorage, 'getItem').mockReturnValue('');

    const { result } = renderHook(() => useRoutingKey());

    expect(result.current.isConfigured).toBe(false);
  });
});
