// MIT License - Copyright (c) fintonlabs.com

import { K8sError } from '../types';
import { TriggerCard } from './TriggerCard';
import styles from './TriggerGrid.module.css';

interface TriggerGridProps {
  errors: K8sError[];
  onTrigger: (error: K8sError) => Promise<void>;
  disabled: boolean;
}

export function TriggerGrid({ errors, onTrigger, disabled }: TriggerGridProps) {
  return (
    <section className={styles.section} aria-labelledby="triggers-heading">
      <div className={styles.header}>
        <h2 id="triggers-heading" className={styles.heading}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Kubernetes Error Triggers
        </h2>
        <span className={styles.count}>{errors.length} scenarios</span>
      </div>

      {disabled && (
        <div className={styles.warning} role="alert">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Configure your routing key above to enable incident triggers
        </div>
      )}

      <div className={styles.grid}>
        {errors.map((error) => (
          <TriggerCard
            key={error.id}
            error={error}
            onTrigger={onTrigger}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  );
}
