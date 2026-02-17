// MIT License - Copyright (c) fintonlabs.com

import { useState, useCallback } from 'react';
import { getRoutingKey, setRoutingKey as saveRoutingKey, clearRoutingKey as removeRoutingKey } from '../services/storage';

export function useRoutingKey() {
  const [routingKey, setRoutingKeyState] = useState<string | null>(() => getRoutingKey());

  const setRoutingKey = useCallback((key: string) => {
    saveRoutingKey(key);
    setRoutingKeyState(key);
  }, []);

  const clearRoutingKey = useCallback(() => {
    removeRoutingKey();
    setRoutingKeyState(null);
  }, []);

  const isConfigured = routingKey !== null && routingKey.length > 0;

  return {
    routingKey,
    setRoutingKey,
    clearRoutingKey,
    isConfigured,
  };
}
