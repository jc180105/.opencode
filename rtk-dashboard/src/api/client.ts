// Minimal API client for RTK Dashboard
export async function getRTKMetrics() {
  const response = await fetch('/api/rtk-metrics');
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getAgentStatus() {
  const response = await fetch('/api/agent-status');
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getGraphPaths() {
  const response = await fetch('/api/graph-paths');
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
