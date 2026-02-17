// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusPanel } from './StatusPanel';
import { TriggerHistoryItem } from '../types';

describe('StatusPanel component', () => {
  it('should render heading', () => {
    render(<StatusPanel history={[]} onClear={() => {}} />);

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('should render empty state when no history', () => {
    render(<StatusPanel history={[]} onClear={() => {}} />);

    expect(screen.getByText(/no triggers yet/i)).toBeInTheDocument();
  });

  it('should not show clear button when empty', () => {
    render(<StatusPanel history={[]} onClear={() => {}} />);

    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('should render history items', () => {
    const history: TriggerHistoryItem[] = [
      {
        id: '1',
        errorType: 'CrashLoopBackOff',
        timestamp: new Date('2025-01-15T10:30:00'),
        status: 'success',
        dedupKey: 'dedup-123',
      },
    ];

    render(<StatusPanel history={history} onClear={() => {}} />);

    expect(screen.getByText('CrashLoopBackOff')).toBeInTheDocument();
    expect(screen.getByText('dedup-123')).toBeInTheDocument();
  });

  it('should render failed item with error message', () => {
    const history: TriggerHistoryItem[] = [
      {
        id: '1',
        errorType: 'OOMKilled',
        timestamp: new Date(),
        status: 'failed',
        errorMessage: 'Connection refused',
      },
    ];

    render(<StatusPanel history={history} onClear={() => {}} />);

    expect(screen.getByText('OOMKilled')).toBeInTheDocument();
    expect(screen.getByText('Connection refused')).toBeInTheDocument();
  });

  it('should show clear button when history has items', () => {
    const history: TriggerHistoryItem[] = [
      {
        id: '1',
        errorType: 'Test',
        timestamp: new Date(),
        status: 'success',
      },
    ];

    render(<StatusPanel history={history} onClear={() => {}} />);

    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('should call onClear when clear button clicked', () => {
    const onClear = vi.fn();
    const history: TriggerHistoryItem[] = [
      {
        id: '1',
        errorType: 'Test',
        timestamp: new Date(),
        status: 'success',
      },
    ];

    render(<StatusPanel history={history} onClear={onClear} />);

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('should render multiple history items', () => {
    const history: TriggerHistoryItem[] = [
      {
        id: '1',
        errorType: 'First Error',
        timestamp: new Date(),
        status: 'success',
      },
      {
        id: '2',
        errorType: 'Second Error',
        timestamp: new Date(),
        status: 'failed',
      },
    ];

    render(<StatusPanel history={history} onClear={() => {}} />);

    expect(screen.getByText('First Error')).toBeInTheDocument();
    expect(screen.getByText('Second Error')).toBeInTheDocument();
  });

  it('should render timestamp for each item', () => {
    const testDate = new Date('2025-01-15T14:30:45');
    const history: TriggerHistoryItem[] = [
      {
        id: '1',
        errorType: 'Test',
        timestamp: testDate,
        status: 'success',
      },
    ];

    render(<StatusPanel history={history} onClear={() => {}} />);

    const timeElement = screen.getByRole('listitem').querySelector('time');
    expect(timeElement).toHaveAttribute('dateTime', testDate.toISOString());
  });

  it('should render without dedup key', () => {
    const history: TriggerHistoryItem[] = [
      {
        id: '1',
        errorType: 'Test',
        timestamp: new Date(),
        status: 'success',
      },
    ];

    render(<StatusPanel history={history} onClear={() => {}} />);

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
