import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AgentStatusGrid } from '@/components/AgentStatusGrid';
import { useAgentStatus } from '@/lib/api';
import { vi } from 'vitest';

// Mock the hook
vi.mock('@/lib/api', () => ({
  useAgentStatus: vi.fn(),
}));

expect.extend(toHaveNoViolations);

describe('AgentStatusGrid', () => {
  const mockAgents = Array.from({ length: 8 }, (_, i) => ({
    id: `agent-${i + 1}`,
    name: `Agent ${i + 1}`,
    role: `Role ${i + 1}`,
    health: i < 6 ? 95 : i < 7 ? 75 : 40,
    status: i < 6 ? 'active' : i < 7 ? 'warning' : 'error',
  }));

  beforeEach(() => {
    (useAgentStatus as vi.Mock).mockReturnValue({
      data: { agents: mockAgents },
      isLoading: false,
      error: null,
    });
  });

  test('renders all 8 agents', () => {
    render(<AgentStatusGrid />);
    mockAgents.forEach(agent => {
      expect(screen.getByText(agent.name)).toBeInTheDocument();
    });
  });

  test('displays correct status badges for each agent', () => {
    render(<AgentStatusGrid />);
    // Check active agents (first 6)
    expect(screen.getAllByText('Active')).toHaveLength(6);
    // Check warning agent (7th)
    expect(screen.getByText('Warning')).toBeInTheDocument();
    // Check error agent (8th)
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    (useAgentStatus as vi.Mock).mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: null,
    });
    render(<AgentStatusGrid />);
    expect(screen.getByText(/loading agents.../i)).toBeInTheDocument();
  });

  test('shows error state', () => {
    (useAgentStatus as vi.Mock).mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
    });
    render(<AgentStatusGrid />);
    expect(screen.getByText(/error loading agent status/i)).toBeInTheDocument();
  });

  test('meets accessibility standards (WCAG 2.1 AA)', async () => {
    const { container } = render(<AgentStatusGrid />);
    const results = await axe(container, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    });
    expect(results).toHaveNoViolations();
  });
});
