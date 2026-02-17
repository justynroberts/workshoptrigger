// MIT License - Copyright (c) fintonlabs.com

import { useState } from 'react';
import { K8sError } from '../types';
import styles from './TriggerCard.module.css';

interface TriggerCardProps {
  error: K8sError;
  onTrigger: (error: K8sError) => Promise<void>;
  disabled: boolean;
}

export function TriggerCard({ error, onTrigger, disabled }: TriggerCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setShowRipple(true);
    setIsLoading(true);

    try {
      await onTrigger(error);
    } catch {
      // Error handling is done by parent component
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowRipple(false), 600);
    }
  };

  return (
    <article className={styles.card} data-severity={error.severity}>
      <div className={styles.header}>
        <span className={styles.severityBadge} data-severity={error.severity}>
          {error.severity}
        </span>
        <span className={styles.component}>{error.component}</span>
      </div>

      <h3 className={styles.name}>{error.name}</h3>
      <p className={styles.description}>{error.description}</p>

      <button
        className={styles.triggerButton}
        onClick={handleClick}
        disabled={disabled || isLoading}
        aria-label={`Trigger ${error.name} incident`}
      >
        {showRipple && <span className={styles.ripple} />}
        {isLoading ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Triggering...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Trigger Incident
          </>
        )}
      </button>
    </article>
  );
}
