// MIT License - Copyright (c) fintonlabs.com

import { useCallback } from 'react';
import { Header, ConfigPanel, TriggerGrid, StatusPanel } from './components';
import { useRoutingKey, useTheme, useTriggerHistory } from './hooks';
import { k8sErrors } from './data/k8sErrors';
import { triggerIncident } from './services/pagerduty';
import { K8sError } from './types';
import styles from './App.module.css';

export function App() {
  const { routingKey, setRoutingKey, clearRoutingKey, isConfigured } = useRoutingKey();
  const { theme, toggleTheme } = useTheme();
  const { history, addToHistory, clearHistory } = useTriggerHistory();

  const handleTrigger = useCallback(async (error: K8sError) => {
    if (!routingKey) return;

    try {
      const response = await triggerIncident(routingKey, error);
      addToHistory({
        errorType: error.name,
        status: 'success',
        dedupKey: response.dedup_key,
      });
    } catch (err) {
      addToHistory({
        errorType: error.name,
        status: 'failed',
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }, [routingKey, addToHistory]);

  return (
    <div className={styles.app}>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        isConfigured={isConfigured}
      />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <ConfigPanel
              routingKey={routingKey}
              onSave={setRoutingKey}
              onClear={clearRoutingKey}
            />
            <StatusPanel
              history={history}
              onClear={clearHistory}
            />
          </div>

          <div className={styles.content}>
            <TriggerGrid
              errors={k8sErrors}
              onTrigger={handleTrigger}
              disabled={!isConfigured}
            />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          PagerDuty Workshop Trigger &middot; For training purposes only &middot;{' '}
          <a
            href="https://developer.pagerduty.com/docs/events-api-v2/trigger-events/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Events API v2 Documentation
          </a>
        </p>
      </footer>
    </div>
  );
}
