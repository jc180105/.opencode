import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RTKEconomyGauge } from '@/components/RTKEconomyGauge';
import { useRtkMetrics } from '@/lib/api';
import { vi } from 'vitest';

// Mock the hook
vi.mock('@/lib/api', () => ({
  useRtkMetrics: vi.fn(),
}));

expect.extend(toHaveNoViolations);

describe('RTKEconomyGauge', () => {
  beforeEach(() => {
    (useRtkMetrics as vi.Mock).mockReturnValue({
      data: { economy_pct: 67.4, tokens_saved: 12345, trend: 1.2 },
      isLoading: false,
      error: null,
    });
  });

  test('renders correct percentage (67.4%)', () => {
    render(<RTKEconomyGauge />);
    const percentageElement = screen.getByText(/67.4%/i);
    expect(percentageElement).toBeInTheDocument();
  });

  test('renders trend indicator with positive trend', () => {
    render(<RTKEconomyGauge />);
    const trendElement = screen.getByText(/\+1.2%/i);
    expect(trendElement).toBeInTheDocument();
    expect(trendElement).toHaveClass('text-green-600');
  });

  test('shows loading state', () => {
    (useRtkMetrics as vi.Mock).mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: null,
    });
    render(<RTKEconomyGauge />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('shows error state', () => {
    (useRtkMetrics as vi.Mock).mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
    });
    render(<RTKEconomyGauge />);
    expect(screen.getByText(/error loading metrics/i)).toBeInTheDocument();
  });

  test('meets accessibility standards (WCAG 2.1 AA)', async () => {
    const { container } = render(<RTKEconomyGauge />);
    const results = await axe(container, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    });
    expect(results).toHaveNoViolations();
  });
});