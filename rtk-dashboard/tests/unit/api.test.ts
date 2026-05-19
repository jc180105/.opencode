import { getRTKMetrics, getAgentStatus, getGraphPaths } from '@/api/client';
import { vi } from 'vitest';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRTKMetrics', () => {
    test('returns data on successful API call', async () => {
      const mockData = { economy_pct: 67.4, tokens_saved: 12345, trend: 1.2 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getRTKMetrics();
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/rtk-metrics');
    });

    test('handles HTTP error responses gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getRTKMetrics()).rejects.toThrow('API error: 500 Internal Server Error');
    });

    test('handles network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getRTKMetrics()).rejects.toThrow('Network error');
    });
  });

  describe('getAgentStatus', () => {
    test('returns agent data on successful API call', async () => {
      const mockAgents = Array.from({ length: 8 }, (_, i) => ({
        id: `agent-${i + 1}`,
        name: `Agent ${i + 1}`,
        status: 'active',
        health: 95,
      }));
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ agents: mockAgents }),
      });

      const result = await getAgentStatus();
      expect(result.agents).toHaveLength(8);
      expect(result.agents[0].name).toBe('Agent 1');
    });

    test('handles unauthorized access (401) gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(getAgentStatus()).rejects.toThrow('API error: 401 Unauthorized');
    });
  });

  describe('getGraphPaths', () => {
    test('returns graph data on successful API call', async () => {
      const mockGraph = { nodes: [], edges: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGraph,
      });

      const result = await getGraphPaths();
      expect(result).toEqual(mockGraph);
    });

    test('handles timeout errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Request timed out'));

      await expect(getGraphPaths()).rejects.toThrow('Request timed out');
    });
  });
});
