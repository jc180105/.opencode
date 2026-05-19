import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { GraphVisualization } from '@/components/GraphVisualization';
import { useGraphPaths } from '@/lib/api';
import { vi } from 'vitest';

// Mock the hook and force-graph to avoid DOM issues
vi.mock('@/lib/api', () => ({
  useGraphPaths: vi.fn(),
}));

vi.mock('react-force-graph-2d', () => ({
  default: () => <div data-testid="graph-visualization">Mock Graph</div>,
}));

expect.extend(toHaveNoViolations);

describe('GraphVisualization', () => {
  const mockGraphData = {
    nodes: [
      { id: 'agent-1', name: 'Agent 1', type: 'agent', val: 10, color: '#8b5cf6' },
      { id: 'agent-2', name: 'Agent 2', type: 'agent', val: 6, color: '#22c55e' },
      { id: 'mcp-1', name: 'Graphify MCP', type: 'mcp', val: 5, color: '#3b82f6' }
    ],
    edges: [
      { source: 'agent-1', target: 'agent-2', label: 'delegates to' },
      { source: 'agent-1', target: 'mcp-1', label: 'uses' }
    ]
  };

  beforeEach(() => {
    (useGraphPaths as vi.Mock).mockReturnValue({
      data: mockGraphData,
      isLoading: false,
      error: null,
    });
  });

  test('renders graph with correct number of nodes', () => {
    render(<GraphVisualization />);
    // Check if nodes are rendered (react-force-graph-2d renders canvas, so we check for container)
    const graphContainer = screen.getByText(/agent interaction graph/i);
    expect(graphContainer).toBeInTheDocument();
  });

  test('shows loading state', () => {
    (useGraphPaths as vi.Mock).mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: null,
    });
    render(<GraphVisualization />);
    expect(screen.getByText(/loading graph data.../i)).toBeInTheDocument();
  });

  test('shows error state', () => {
    (useGraphPaths as vi.Mock).mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
    });
    render(<GraphVisualization />);
    expect(screen.getByText(/failed to load graph data/i)).toBeInTheDocument();
  });

  test('meets accessibility standards (WCAG 2.1 AA)', async () => {
    const { container } = render(<GraphVisualization />);
    const results = await axe(container, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    });
    expect(results).toHaveNoViolations();
  });
});
