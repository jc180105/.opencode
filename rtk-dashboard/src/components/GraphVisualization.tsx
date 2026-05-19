import ForceGraph2D from "react-force-graph-2d"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGraphPaths } from "@/lib/api"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export function GraphVisualization() {
  const { data: graphData, isLoading, error } = useGraphPaths()

  if (isLoading) return (
    <Card className={cn("shadow-sm")}>
      <CardHeader>
        <CardTitle className="text-lg">Agent Interaction Graph</CardTitle>
        <p className="text-sm text-muted-foreground">50+ interaction paths between agents</p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading graph data...</p>
        </div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card className={cn("shadow-sm")}>
      <CardHeader>
        <CardTitle className="text-lg">Agent Interaction Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Failed to load graph data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Use real data or fallback to mock
  const nodes = graphData?.nodes || [
    { id: "maestro", name: "Maestro", val: 10, color: "#8b5cf6" },
    { id: "frontend", name: "Frontend", val: 6, color: "#22c55e" },
    { id: "backend", name: "Backend", val: 8, color: "#3b82f6" },
    { id: "security", name: "Security", val: 5, color: "#ef4444" },
    { id: "data-engineer", name: "Data Eng", val: 5, color: "#f59e0b" },
    { id: "qa", name: "QA", val: 4, color: "#a855f7" },
    { id: "devops", name: "DevOps", val: 5, color: "#06b6d4" },
    { id: "code-review", name: "Code Review", val: 4, color: "#ec4899" },
  ]

  const links = graphData?.links || [
    { source: "maestro", target: "frontend" },
    { source: "maestro", target: "backend" },
    { source: "maestro", target: "security" },
    { source: "frontend", target: "backend" },
    { source: "backend", target: "data-engineer" },
    { source: "security", target: "devops" },
    { source: "qa", target: "code-review" },
  ]

  return (
    <Card className={cn("shadow-sm")}>
      <CardHeader>
        <CardTitle className="text-lg">Agent Interaction Graph</CardTitle>
        <p className="text-sm text-muted-foreground">
          {graphData ? 'Real-time agent interactions' : 'Mock data (50+ interaction paths)'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full rounded-lg border border-border bg-muted/20">
          <ForceGraph2D
            graphData={{ nodes, links }}
            nodeLabel="name"
            nodeColor="color"
            nodeVal="val"
            linkColor={() => "#94a3b8"}
            linkWidth={1}
            backgroundColor="transparent"
            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
              const label = node.name
              const fontSize = 12 / globalScale
              ctx.font = `${fontSize}px Sans-Serif`
              ctx.fillStyle = node.color || "#666"
              ctx.beginPath()
              ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false)
              ctx.fill()
              ctx.fillStyle = "#fff"
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
              ctx.fillText(label, node.x, node.y)
            }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {nodes.map((node: any) => (
            <div key={node.id} className="flex items-center gap-1 text-xs">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: node.color }} />
              <span className="text-muted-foreground">{node.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
