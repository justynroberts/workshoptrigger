// MIT License - Copyright (c) fintonlabs.com

import { useState } from 'react';
import { K8sError } from '../types';
import { buildPayload } from '../services/pagerduty';
import styles from './TriggerCard.module.css';

interface TriggerCardProps {
  error: K8sError;
  onTrigger: (error: K8sError) => Promise<void>;
  disabled: boolean;
}

export function TriggerCard({ error, onTrigger, disabled }: TriggerCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [showPayload, setShowPayload] = useState(false);

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

  const getPayloadPreview = () => {
    const payload = buildPayload('<routing_key>', error);
    return {
      event_action: payload.event_action,
      payload: {
        summary: payload.payload.summary,
        source: payload.payload.source,
        severity: payload.payload.severity,
        component: payload.payload.component,
        group: payload.payload.group,
        class: payload.payload.class,
        custom_details: payload.payload.custom_details,
      },
    };
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
        type="button"
        className={styles.payloadToggle}
        onClick={() => setShowPayload(!showPayload)}
        aria-expanded={showPayload}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M16 18l2-2-4-4 4-4-2-2-6 6 6 6z" fill="currentColor" />
          <path d="M8 18l-2-2 4-4-4-4 2-2 6 6-6 6z" fill="currentColor" />
        </svg>
        {showPayload ? 'Hide' : 'View'} Payload
      </button>

      {showPayload && (
        <pre className={styles.payloadPreview}>
          {JSON.stringify(getPayloadPreview(), null, 2)}
        </pre>
      )}

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
