// MIT License - Copyright (c) fintonlabs.com

import { useState, FormEvent } from 'react';
import styles from './ConfigPanel.module.css';

interface ConfigPanelProps {
  routingKey: string | null;
  onSave: (key: string) => void;
  onClear: () => void;
}

export function ConfigPanel({ routingKey, onSave, onClear }: ConfigPanelProps) {
  const [inputValue, setInputValue] = useState(routingKey || '');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError('Routing key is required');
      return;
    }

    if (trimmed.length < 20) {
      setError('Routing key appears to be invalid (too short)');
      return;
    }

    setError(null);
    onSave(trimmed);
  };

  const handleClear = () => {
    setInputValue('');
    setError(null);
    onClear();
  };

  const isConfigured = routingKey !== null && routingKey.length > 0;

  return (
    <section className={styles.panel} aria-labelledby="config-heading">
      <div className={styles.header}>
        <h2 id="config-heading" className={styles.heading}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 7h4a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 15V3M12 3l-3 3M12 3l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Configuration
        </h2>
        {isConfigured && (
          <span className={styles.badge}>Active</span>
        )}
      </div>

      <p className={styles.description}>
        Enter your PagerDuty Events API v2 routing key (integration key) to enable incident triggers.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="routing-key" className={styles.label}>
            Routing Key
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="routing-key"
              type={showKey ? 'text' : 'password'}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
              }}
              placeholder="Enter your routing key..."
              className={styles.input}
              aria-describedby={error ? 'routing-key-error' : undefined}
              aria-invalid={error ? 'true' : 'false'}
            />
            <button
              type="button"
              className={styles.toggleVisibility}
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? 'Hide routing key' : 'Show routing key'}
            >
              {showKey ? (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>
          {error && (
            <p id="routing-key-error" className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Save Key
          </button>
          {isConfigured && (
            <button type="button" className={styles.clearButton} onClick={handleClear}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </form>

      <p className={styles.securityNote}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Your key is stored only in your browser session and is never sent to any server except PagerDuty.
      </p>
    </section>
  );
}
