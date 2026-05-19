import { useQuery } from "@tanstack/react-query"

// Supabase project configuration
const SUPABASE_URL = 'https://owjcgaookmiofnoyztxd.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93amNnYW9va21pb2Zub3l6dHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNjUyMzUsImV4cCI6MjA1Mjc0MTIzNX0.2lPqhoJRB-hd5-GN30atxNJbUHnFu4H1M7VLAAY0blY'

// Common fetch options for Supabase Edge Functions
const fetchOptions = (method: string = 'GET', body?: any) => ({
  method,
  headers: {
    'Authorization': `Bearer ${ANON_KEY}`,
    'Content-Type': 'application/json',
  },
  ...(body && { body: JSON.stringify(body) }),
})

// Types for API responses
interface RtkMetricsResponse {
  economy_pct: number
  tokens_saved: number
  trend: number
  history: Array<{
    date: string
    savings_pct: number
    tokens_saved: number
    commands: number
  }>
}

interface AgentStatusResponse {
  agents: Array<{
    id: string
    name: string
    role: string
    status: string
    health: number
  }>
}

interface GraphPathsResponse {
  nodes: Array<{
    id: string
    name: string
    val: number
    color: string
  }>
  links: Array<{
    source: string
    target: string
  }>
}

// API Functions
const fetchRtkMetrics = async (): Promise<RtkMetricsResponse> => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/rtk-metrics`, fetchOptions())
  if (!response.ok) {
    throw new Error(`RTK Metrics API error: ${response.statusText}`)
  }
  return response.json()
}

const fetchAgentStatus = async (): Promise<AgentStatusResponse> => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/agent-status`, fetchOptions())
  if (!response.ok) {
    throw new Error(`Agent Status API error: ${response.statusText}`)
  }
  return response.json()
}

const fetchGraphPaths = async (): Promise<GraphPathsResponse> => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/graph-paths`, fetchOptions())
  if (!response.ok) {
    throw new Error(`Graph Paths API error: ${response.statusText}`)
  }
  return response.json()
}

// React Query hooks
export const useRtkMetrics = () => {
  return useQuery({
    queryKey: ['rtkMetrics'],
    queryFn: fetchRtkMetrics,
    refetchInterval: 30000, // Refetch every 30s
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useAgentStatus = () => {
  return useQuery({
    queryKey: ['agentStatus'],
    queryFn: fetchAgentStatus,
    refetchInterval: 10000, // Refetch every 10s
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useGraphPaths = () => {
  return useQuery({
    queryKey: ['graphPaths'],
    queryFn: fetchGraphPaths,
    refetchInterval: 60000, // Refetch every 60s
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Keep mock for SharedMemory (no Edge Function yet)
export const useSharedMemory = () => {
  return useQuery({
    queryKey: ['sharedMemory'],
    queryFn: async () => ({
      teams: [
        { name: "feature-team", entries: 3 },
        { name: "infra-team", entries: 2 },
        { name: "data-team", entries: 2 },
      ],
      totalEntries: 7
    }),
    staleTime: Infinity,
  })
}
