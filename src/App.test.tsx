// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

vi.mock('./services/pagerduty', () => ({
  triggerIncident: vi.fn(),
}));

import { triggerIncident } from './services/pagerduty';

describe('App component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(sessionStorage, 'getItem').mockReturnValue(null);
    vi.spyOn(localStorage, 'getItem').mockReturnValue('dark');
  });

  it('should render header', () => {
    render(<App />);

    expect(screen.getByText('PagerDuty Workshop Trigger')).toBeInTheDocument();
  });

  it('should render config panel', () => {
    render(<App />);

    expect(screen.getByText('Configuration')).toBeInTheDocument();
  });

  it('should render trigger grid', () => {
    render(<App />);

    expect(screen.getByText('Kubernetes Error Triggers')).toBeInTheDocument();
  });

  it('should render status panel', () => {
    render(<App />);

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(<App />);

    expect(screen.getByText(/for training purposes only/i)).toBeInTheDocument();
  });

  it('should render footer link', () => {
    render(<App />);

    const link = screen.getByRole('link', { name: /events api v2 documentation/i });
    expect(link).toHaveAttribute('href', 'https://developer.pagerduty.com/docs/events-api-v2/trigger-events/');
  });

  it('should show not configured status initially', () => {
    render(<App />);

    expect(screen.getByText('Not Configured')).toBeInTheDocument();
  });

  it('should disable triggers when not configured', () => {
    render(<App />);

    const warning = screen.getByRole('alert');
    expect(warning).toHaveTextContent(/configure your routing key/i);
  });

  it('should enable triggers after configuring routing key', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText('Routing Key');
    await user.type(input, 'valid-routing-key-12345678');

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Configured')).toBeInTheDocument();
  });

  it('should trigger incident and add to history on success', async () => {
    vi.mocked(triggerIncident).mockResolvedValue({
      status: 'success',
      dedup_key: 'test-dedup-123',
      message: 'Event processed',
    });

    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText('Routing Key');
    await user.type(input, 'valid-routing-key-12345678');

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    const triggerButtons = screen.getAllByRole('button', { name: /trigger.*incident/i });
    await user.click(triggerButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('test-dedup-123')).toBeInTheDocument();
    });
  });

  it('should add failed entry to history on error', async () => {
    vi.mocked(triggerIncident).mockRejectedValue(new Error('API Error'));

    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText('Routing Key');
    await user.type(input, 'valid-routing-key-12345678');

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    const triggerButtons = screen.getAllByRole('button', { name: /trigger.*incident/i });
    await user.click(triggerButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('should handle non-Error objects in catch block', async () => {
    vi.mocked(triggerIncident).mockRejectedValue('String error');

    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText('Routing Key');
    await user.type(input, 'valid-routing-key-12345678');

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    const triggerButtons = screen.getAllByRole('button', { name: /trigger.*incident/i });
    await user.click(triggerButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Unknown error')).toBeInTheDocument();
    });
  });

  it('should toggle theme', async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeButton = screen.getByLabelText(/switch to light mode/i);
    await user.click(themeButton);

    expect(screen.getByLabelText(/switch to dark mode/i)).toBeInTheDocument();
  });

  it('should clear routing key', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText('Routing Key');
    await user.type(input, 'valid-routing-key-12345678');

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    expect(screen.getByText('Configured')).toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /clear$/i });
    await user.click(clearButton);

    expect(screen.getByText('Not Configured')).toBeInTheDocument();
  });

  it('should clear history', async () => {
    vi.mocked(triggerIncident).mockResolvedValue({
      status: 'success',
      dedup_key: 'test-123',
      message: 'ok',
    });

    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText('Routing Key');
    await user.type(input, 'valid-routing-key-12345678');

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    const triggerButtons = screen.getAllByRole('button', { name: /trigger.*incident/i });
    await user.click(triggerButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('test-123')).toBeInTheDocument();
    });

    const clearHistoryButton = screen.getByRole('button', { name: /clear activity history/i });
    fireEvent.click(clearHistoryButton);

    expect(screen.queryByText('test-123')).not.toBeInTheDocument();
    expect(screen.getByText(/no triggers yet/i)).toBeInTheDocument();
  });

  it('should not trigger when routing key is null', async () => {
    render(<App />);

    const triggerButtons = screen.getAllByRole('button', { name: /trigger.*incident/i });
    fireEvent.click(triggerButtons[0]);

    expect(triggerIncident).not.toHaveBeenCalled();
  });
});
