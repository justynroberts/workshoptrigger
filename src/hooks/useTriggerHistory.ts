// MIT License - Copyright (c) fintonlabs.com

import { useState, useCallback } from 'react';
import { TriggerHistoryItem } from '../types';

const MAX_HISTORY_ITEMS = 5;

export function useTriggerHistory() {
  const [history, setHistory] = useState<TriggerHistoryItem[]>([]);

  const addToHistory = useCallback((item: Omit<TriggerHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: TriggerHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
    };

    setHistory((prev) => [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
  };
}
