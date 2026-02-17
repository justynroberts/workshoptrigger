// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTriggerHistory } from './useTriggerHistory';

describe('useTriggerHistory hook', () => {
  it('should start with empty history', () => {
    const { result } = renderHook(() => useTriggerHistory());

    expect(result.current.history).toEqual([]);
  });

  it('should add item to history', () => {
    const { result } = renderHook(() => useTriggerHistory());

    act(() => {
      result.current.addToHistory({
        errorType: 'CrashLoopBackOff',
        status: 'success',
        dedupKey: 'test-dedup-key',
      });
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].errorType).toBe('CrashLoopBackOff');
    expect(result.current.history[0].status).toBe('success');
    expect(result.current.history[0].dedupKey).toBe('test-dedup-key');
    expect(result.current.history[0].id).toBeDefined();
    expect(result.current.history[0].timestamp).toBeInstanceOf(Date);
  });

  it('should add failed item with error message', () => {
    const { result } = renderHook(() => useTriggerHistory());

    act(() => {
      result.current.addToHistory({
        errorType: 'OOMKilled',
        status: 'failed',
        errorMessage: 'Connection timeout',
      });
    });

    expect(result.current.history[0].status).toBe('failed');
    expect(result.current.history[0].errorMessage).toBe('Connection timeout');
  });

  it('should prepend new items to history', () => {
    const { result } = renderHook(() => useTriggerHistory());

    act(() => {
      result.current.addToHistory({ errorType: 'First', status: 'success' });
    });

    act(() => {
      result.current.addToHistory({ errorType: 'Second', status: 'success' });
    });

    expect(result.current.history[0].errorType).toBe('Second');
    expect(result.current.history[1].errorType).toBe('First');
  });

  it('should limit history to 5 items', () => {
    const { result } = renderHook(() => useTriggerHistory());

    act(() => {
      for (let i = 1; i <= 7; i++) {
        result.current.addToHistory({ errorType: `Error ${i}`, status: 'success' });
      }
    });

    expect(result.current.history).toHaveLength(5);
    expect(result.current.history[0].errorType).toBe('Error 7');
    expect(result.current.history[4].errorType).toBe('Error 3');
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useTriggerHistory());

    act(() => {
      result.current.addToHistory({ errorType: 'Test', status: 'success' });
      result.current.addToHistory({ errorType: 'Test 2', status: 'failed' });
    });

    expect(result.current.history).toHaveLength(2);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
  });

  it('should generate unique IDs for each item', () => {
    const { result } = renderHook(() => useTriggerHistory());

    act(() => {
      result.current.addToHistory({ errorType: 'Test', status: 'success' });
      result.current.addToHistory({ errorType: 'Test', status: 'success' });
    });

    expect(result.current.history[0].id).not.toBe(result.current.history[1].id);
  });
});
