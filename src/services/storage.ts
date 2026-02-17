// MIT License - Copyright (c) fintonlabs.com

import { Theme } from '../types';

const ROUTING_KEY_STORAGE_KEY = 'pagerduty_routing_key';
const THEME_STORAGE_KEY = 'pagerduty_workshop_theme';

export function getRoutingKey(): string | null {
  return sessionStorage.getItem(ROUTING_KEY_STORAGE_KEY);
}

export function setRoutingKey(key: string): void {
  sessionStorage.setItem(ROUTING_KEY_STORAGE_KEY, key);
}

export function clearRoutingKey(): void {
  sessionStorage.removeItem(ROUTING_KEY_STORAGE_KEY);
}

export function getTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return 'dark';
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
