// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme hook', () => {
  it('should return dark theme by default', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('should return stored theme', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue('light');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
  });

  it('should set theme and update storage', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue('dark');

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pagerduty_workshop_theme',
      'light'
    );
  });

  it('should toggle theme from dark to light', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue('dark');

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('should toggle theme from light to dark', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue('light');

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should set data-theme attribute on document', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue('dark');

    renderHook(() => useTheme());

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
