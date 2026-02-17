// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header component', () => {
  it('should render title', () => {
    render(<Header theme="dark" onToggleTheme={() => {}} isConfigured={false} />);

    expect(screen.getByText('PagerDuty Workshop Trigger')).toBeInTheDocument();
  });

  it('should render subtitle', () => {
    render(<Header theme="dark" onToggleTheme={() => {}} isConfigured={false} />);

    expect(screen.getByText('Kubernetes Error Simulator')).toBeInTheDocument();
  });

  it('should show not configured status when isConfigured is false', () => {
    render(<Header theme="dark" onToggleTheme={() => {}} isConfigured={false} />);

    expect(screen.getByText('Not Configured')).toBeInTheDocument();
  });

  it('should show configured status when isConfigured is true', () => {
    render(<Header theme="dark" onToggleTheme={() => {}} isConfigured={true} />);

    expect(screen.getByText('Configured')).toBeInTheDocument();
  });

  it('should call onToggleTheme when theme button clicked', () => {
    const onToggleTheme = vi.fn();
    render(<Header theme="dark" onToggleTheme={onToggleTheme} isConfigured={false} />);

    const button = screen.getByRole('button', { name: /switch to light mode/i });
    fireEvent.click(button);

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should show light mode button label when in dark mode', () => {
    render(<Header theme="dark" onToggleTheme={() => {}} isConfigured={false} />);

    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('should show dark mode button label when in light mode', () => {
    render(<Header theme="light" onToggleTheme={() => {}} isConfigured={false} />);

    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });
});
