// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TriggerCard } from './TriggerCard';
import { K8sError } from '../types';

const mockError: K8sError = {
  id: 'crash-loop',
  name: 'Pod CrashLoopBackOff',
  severity: 'critical',
  description: 'Container repeatedly crashing and restarting',
  component: 'pod',
  errorClass: 'CrashLoopBackOff',
};

describe('TriggerCard component', () => {
  it('should render error name', () => {
    render(<TriggerCard error={mockError} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByText('Pod CrashLoopBackOff')).toBeInTheDocument();
  });

  it('should render error description', () => {
    render(<TriggerCard error={mockError} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByText('Container repeatedly crashing and restarting')).toBeInTheDocument();
  });

  it('should render severity badge', () => {
    render(<TriggerCard error={mockError} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByText('critical')).toBeInTheDocument();
  });

  it('should render component type', () => {
    render(<TriggerCard error={mockError} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByText('pod')).toBeInTheDocument();
  });

  it('should render trigger button', () => {
    render(<TriggerCard error={mockError} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByRole('button', { name: /trigger .* incident/i })).toBeInTheDocument();
  });

  it('should call onTrigger when button clicked', async () => {
    const onTrigger = vi.fn().mockResolvedValue(undefined);
    render(<TriggerCard error={mockError} onTrigger={onTrigger} disabled={false} />);

    const button = screen.getByRole('button', { name: /trigger/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onTrigger).toHaveBeenCalledWith(mockError);
    });
  });

  it('should show loading state when triggering', async () => {
    const onTrigger = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<TriggerCard error={mockError} onTrigger={onTrigger} disabled={false} />);

    const button = screen.getByRole('button', { name: /trigger/i });
    fireEvent.click(button);

    expect(screen.getByText('Triggering...')).toBeInTheDocument();
  });

  it('should disable button when disabled prop is true', () => {
    render(<TriggerCard error={mockError} onTrigger={() => Promise.resolve()} disabled={true} />);

    const button = screen.getByRole('button', { name: /trigger/i });
    expect(button).toBeDisabled();
  });

  it('should not call onTrigger when disabled', async () => {
    const onTrigger = vi.fn();
    render(<TriggerCard error={mockError} onTrigger={onTrigger} disabled={true} />);

    const button = screen.getByRole('button', { name: /trigger/i });
    fireEvent.click(button);

    expect(onTrigger).not.toHaveBeenCalled();
  });

  it('should not call onTrigger while loading', async () => {
    const onTrigger = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<TriggerCard error={mockError} onTrigger={onTrigger} disabled={false} />);

    const button = screen.getByRole('button', { name: /trigger/i });
    fireEvent.click(button);
    fireEvent.click(button);

    expect(onTrigger).toHaveBeenCalledTimes(1);
  });

  it('should reset loading state after trigger completes', async () => {
    const onTrigger = vi.fn().mockResolvedValue(undefined);
    render(<TriggerCard error={mockError} onTrigger={onTrigger} disabled={false} />);

    const button = screen.getByRole('button', { name: /trigger/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Trigger Incident')).toBeInTheDocument();
    });
  });

  it('should reset loading state after trigger fails', async () => {
    const onTrigger = vi.fn().mockRejectedValue(new Error('Failed'));
    render(<TriggerCard error={mockError} onTrigger={onTrigger} disabled={false} />);

    const button = screen.getByRole('button', { name: /trigger/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Trigger Incident')).toBeInTheDocument();
    });
  });

  it('should render with warning severity', () => {
    const warningError: K8sError = {
      ...mockError,
      severity: 'warning',
    };
    render(<TriggerCard error={warningError} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByText('warning')).toBeInTheDocument();
  });

  it('should render with error severity', () => {
    const errorSeverity: K8sError = {
      ...mockError,
      severity: 'error',
    };
    render(<TriggerCard error={errorSeverity} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('should render View Payload button', () => {
    render(<TriggerCard error={mockError} onTrigger={() => Promise.resolve()} disabled={false} />);

    expect(screen.getByRole('button', { name: /view payload/i })).toBeInTheDocument();
  });

  it('should toggle payload preview when View Payload clicked', () => {
    render(<TriggerCard error={mockError} onTrigger={() => Promise.resolve()} disabled={false} />);

    const toggleButton = screen.getByRole('button', { name: /view payload/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText(/event_action/)).toBeInTheDocument();
    expect(screen.getByText(/custom_details/)).toBeInTheDocument();
    expect(screen.getByText(/payment/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hide payload/i })).toBeInTheDocument();
  });

  it('should hide payload preview when Hide Payload clicked', () => {
    render(<TriggerCard error={mockError} onTrigger={() => Promise.resolve()} disabled={false} />);

    const toggleButton = screen.getByRole('button', { name: /view payload/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText(/event_action/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /hide payload/i }));

    expect(screen.queryByText(/event_action/)).not.toBeInTheDocument();
  });
});
