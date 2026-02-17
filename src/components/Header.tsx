// MIT License - Copyright (c) fintonlabs.com

import { Theme } from '../types';
import styles from './Header.module.css';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  isConfigured: boolean;
}

export function Header({ theme, onToggleTheme, isConfigured }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <svg
          className={styles.logo}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className={styles.title}>
          <h1>PagerDuty Workshop Trigger</h1>
          <span className={styles.subtitle}>Kubernetes Error Simulator</span>
        </div>
      </div>
      <div className={styles.controls}>
        <div className={styles.status} data-configured={isConfigured}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span className={styles.statusText}>
            {isConfigured ? 'Configured' : 'Not Configured'}
          </span>
        </div>
        <button
          className={styles.themeToggle}
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
