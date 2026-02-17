// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getRoutingKey,
  setRoutingKey,
  clearRoutingKey,
  getTheme,
  setTheme,
} from './storage';

describe('storage service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('routing key', () => {
    it('should get routing key from sessionStorage', () => {
      vi.spyOn(sessionStorage, 'getItem').mockReturnValue('test-key-123');

      const result = getRoutingKey();

      expect(result).toBe('test-key-123');
      expect(sessionStorage.getItem).toHaveBeenCalledWith('pagerduty_routing_key');
    });

    it('should return null when no routing key exists', () => {
      vi.spyOn(sessionStorage, 'getItem').mockReturnValue(null);

      const result = getRoutingKey();

      expect(result).toBeNull();
    });

    it('should set routing key in sessionStorage', () => {
      setRoutingKey('new-key-456');

      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'pagerduty_routing_key',
        'new-key-456'
      );
    });

    it('should clear routing key from sessionStorage', () => {
      clearRoutingKey();

      expect(sessionStorage.removeItem).toHaveBeenCalledWith('pagerduty_routing_key');
    });
  });

  describe('theme', () => {
    it('should get dark theme from localStorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue('dark');

      const result = getTheme();

      expect(result).toBe('dark');
    });

    it('should get light theme from localStorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue('light');

      const result = getTheme();

      expect(result).toBe('light');
    });

    it('should default to dark theme when no theme stored', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

      const result = getTheme();

      expect(result).toBe('dark');
    });

    it('should default to dark theme for invalid stored value', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue('invalid');

      const result = getTheme();

      expect(result).toBe('dark');
    });

    it('should set theme in localStorage', () => {
      setTheme('light');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'pagerduty_workshop_theme',
        'light'
      );
    });
  });
});
