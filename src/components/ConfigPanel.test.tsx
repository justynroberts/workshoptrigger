// MIT License - Copyright (c) fintonlabs.com

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigPanel } from './ConfigPanel';

describe('ConfigPanel component', () => {
  it('should render configuration heading', () => {
    render(<ConfigPanel routingKey={null} onSave={() => {}} onClear={() => {}} />);

    expect(screen.getByText('Configuration')).toBeInTheDocument();
  });

  it('should render routing key input', () => {
    render(<ConfigPanel routingKey={null} onSave={() => {}} onClear={() => {}} />);

    expect(screen.getByLabelText('Routing Key')).toBeInTheDocument();
  });

  it('should show password input type by default', () => {
    render(<ConfigPanel routingKey={null} onSave={() => {}} onClear={() => {}} />);

    const input = screen.getByLabelText('Routing Key');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should toggle input visibility when eye button clicked', async () => {
    const user = userEvent.setup();
    render(<ConfigPanel routingKey={null} onSave={() => {}} onClear={() => {}} />);

    const input = screen.getByLabelText('Routing Key');
    const toggleButton = screen.getByLabelText('Show routing key');

    await user.click(toggleButton);

    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide routing key')).toBeInTheDocument();
  });

  it('should call onSave with trimmed value on submit', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ConfigPanel routingKey={null} onSave={onSave} onClear={() => {}} />);

    const input = screen.getByLabelText('Routing Key');
    await user.type(input, '  valid-routing-key-12345678  ');

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    expect(onSave).toHaveBeenCalledWith('valid-routing-key-12345678');
  });

  it('should show error for empty input', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ConfigPanel routingKey={null} onSave={onSave} onClear={() => {}} />);

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    expect(screen.getByText('Routing key is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('should show error for short input', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ConfigPanel routingKey={null} onSave={onSave} onClear={() => {}} />);

    const input = screen.getByLabelText('Routing Key');
    await user.type(input, 'short');

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    expect(screen.getByText('Routing key appears to be invalid (too short)')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('should show Active badge when configured', () => {
    render(<ConfigPanel routingKey="existing-key-123456789012" onSave={() => {}} onClear={() => {}} />);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should show Clear button when configured', () => {
    render(<ConfigPanel routingKey="existing-key-123456789012" onSave={() => {}} onClear={() => {}} />);

    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('should call onClear when Clear button clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<ConfigPanel routingKey="existing-key-123456789012" onSave={() => {}} onClear={onClear} />);

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('should clear input and error when Clear button clicked', async () => {
    const user = userEvent.setup();
    render(<ConfigPanel routingKey="existing-key-123456789012" onSave={() => {}} onClear={() => {}} />);

    const input = screen.getByLabelText('Routing Key');
    expect(input).toHaveValue('existing-key-123456789012');

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    expect(input).toHaveValue('');
  });

  it('should clear error when typing', async () => {
    const user = userEvent.setup();
    render(<ConfigPanel routingKey={null} onSave={() => {}} onClear={() => {}} />);

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    expect(screen.getByText('Routing key is required')).toBeInTheDocument();

    const input = screen.getByLabelText('Routing Key');
    await user.type(input, 'a');

    expect(screen.queryByText('Routing key is required')).not.toBeInTheDocument();
  });

  it('should show security note', () => {
    render(<ConfigPanel routingKey={null} onSave={() => {}} onClear={() => {}} />);

    expect(screen.getByText(/your key is stored only in your browser session/i)).toBeInTheDocument();
  });

  it('should not show Clear button when not configured', () => {
    render(<ConfigPanel routingKey={null} onSave={() => {}} onClear={() => {}} />);

    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });
});
