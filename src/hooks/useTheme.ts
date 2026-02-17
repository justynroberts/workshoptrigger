// MIT License - Copyright (c) fintonlabs.com

import { useState, useCallback, useEffect } from 'react';
import { Theme } from '../types';
import { getTheme, setTheme as saveTheme } from '../services/storage';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    saveTheme(newTheme);
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
