import { useAgentStatus } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Health color mapping
const getHealthColor = (health: number) => {
  if (health >= 90) return "bg-green-500"
  if (health >= 70) return "bg-yellow-500"
  return "bg-red-500"
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
    case "warning":
      return <Badge variant="destructive">Warning</Badge>
    case "error":
      return <Badge variant="destructive">Error</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function AgentStatusGrid() {
  const { data, isLoading, error } = useAgentStatus()

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">Loading agents...</div>
  if (error) return <div className="text-destructive">Error loading agent status</div>
  if (!data?.agents?.length) return <div>No agent data available</div>

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Agent Status</h2>
        <p className="text-sm text-muted-foreground">8 agents across the system</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.agents.map((agent: any) => (
          <Card key={agent.id} className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", getHealthColor(agent.health))} />
                {getStatusBadge(agent.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground mb-2">{agent.role}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Health</span>
                <span className={cn(
                  "text-sm font-semibold",
                  agent.health >= 90 ? "text-green-600" : agent.health >= 70 ? "text-yellow-600" : "text-red-600"
                )}>
                  {agent.health}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", getHealthColor(agent.health))}
                  style={{ width: `${agent.health}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
