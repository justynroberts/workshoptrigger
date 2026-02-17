// MIT License - Copyright (c) fintonlabs.com

import { TriggerHistoryItem } from '../types';
import styles from './StatusPanel.module.css';

interface StatusPanelProps {
  history: TriggerHistoryItem[];
  onClear: () => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function StatusPanel({ history, onClear }: StatusPanelProps) {
  if (history.length === 0) {
    return (
      <section className={styles.panel} aria-labelledby="status-heading">
        <h2 id="status-heading" className={styles.heading}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          </svg>
          Recent Activity
        </h2>
        <p className={styles.empty}>
          No triggers yet. Configure your routing key and trigger an incident to see activity here.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-labelledby="status-heading">
      <div className={styles.header}>
        <h2 id="status-heading" className={styles.heading}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          </svg>
          Recent Activity
        </h2>
        <button className={styles.clearButton} onClick={onClear} aria-label="Clear activity history">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Clear
        </button>
      </div>

      <ul className={styles.list} aria-label="Trigger history">
        {history.map((item) => (
          <li key={item.id} className={styles.item} data-status={item.status}>
            <div className={styles.statusIcon} aria-hidden="true">
              {item.status === 'success' ? (
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div className={styles.itemContent}>
              <span className={styles.errorType}>{item.errorType}</span>
              {item.dedupKey && (
                <code className={styles.dedupKey}>{item.dedupKey}</code>
              )}
              {item.errorMessage && (
                <span className={styles.errorMessage}>{item.errorMessage}</span>
              )}
            </div>
            <time className={styles.timestamp} dateTime={item.timestamp.toISOString()}>
              {formatTime(item.timestamp)}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}
