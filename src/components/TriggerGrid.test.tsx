// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TriggerGrid } from './TriggerGrid';
import { K8sError } from '../types';

const mockErrors: K8sError[] = [
  {
    id: 'crash-loop',
    name: 'Pod CrashLoopBackOff',
    severity: 'critical',
    description: 'Container repeatedly crashing',
    component: 'pod',
    errorClass: 'CrashLoopBackOff',
  },
  {
    id: 'oom-killed',
    name: 'OOMKilled',
    severity: 'critical',
    description: 'Memory exceeded',
    component: 'container',
    errorClass: 'OOMKilled',
  },
];

describe('TriggerGrid component', () => {
  it('should render heading', () => {
    render(<TriggerGrid errors={mockErrors} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByText('Kubernetes Error Triggers')).toBeInTheDocument();
  });

  it('should render scenario count', () => {
    render(<TriggerGrid errors={mockErrors} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByText('2 scenarios')).toBeInTheDocument();
  });

  it('should render all error cards', () => {
    render(<TriggerGrid errors={mockErrors} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByText('Pod CrashLoopBackOff')).toBeInTheDocument();
    expect(screen.getByText('OOMKilled')).toBeInTheDocument();
  });

  it('should show warning when disabled', () => {
    render(<TriggerGrid errors={mockErrors} onTrigger={() => Promise.resolve()} disabled={true} />);

    expect(screen.getByRole('alert')).toHaveTextContent(/configure your routing key/i);
  });

  it('should not show warning when enabled', () => {
    render(<TriggerGrid errors={mockErrors} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render empty grid with no errors', () => {
    render(<TriggerGrid errors={[]} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByText('0 scenarios')).toBeInTheDocument();
  });

  it('should pass disabled prop to cards', () => {
    render(<TriggerGrid errors={mockErrors} onTrigger={() => Promise.resolve()} disabled={true} />);

    const buttons = screen.getAllByRole('button', { name: /trigger/i });
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
