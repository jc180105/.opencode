import { RTKEconomyGauge } from "@/components/RTKEconomyGauge"
import { AgentStatusGrid } from "@/components/AgentStatusGrid"
import { MetricsChart } from "@/components/MetricsChart"
import { SharedMemoryViewer } from "@/components/SharedMemoryViewer"
import { GraphVisualization } from "@/components/GraphVisualization"
import { Layout } from "@/components/Layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time RTK economy metrics and agent health monitoring
          </p>
        </div>

        {/* Main Gauge + Tabs for other components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RTKEconomyGauge />
          </div>
          <div className="lg:col-span-2">
            <Tabs defaultValue="agents" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="agents">Agents</TabsTrigger>
                <TabsTrigger value="graph">Graph</TabsTrigger>
                <TabsTrigger value="memory">Memory</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="agents" className="mt-4">
                <AgentStatusGrid />
              </TabsContent>
              <TabsContent value="graph" className="mt-4">
                <GraphVisualization />
              </TabsContent>
              <TabsContent value="memory" className="mt-4">
                <SharedMemoryViewer />
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <MetricsChart />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Full Width Components */}
        <div className="grid grid-cols-1 gap-6">
          <MetricsChart />
          <GraphVisualization />
        </div>
      </div>
    </Layout>
  )
}
