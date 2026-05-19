import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from "recharts"
import { useRtkMetrics } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RTKEconomyGauge() {
  const { data, isLoading, error } = useRtkMetrics()

  if (isLoading) return <div className="h-[300px] flex items-center justify-center">Loading...</div>
  if (error) return <div className="h-[300px] flex items-center justify-center text-destructive">Error loading metrics</div>

  const savingsPct = data?.economy_pct || 0
  const tokensSaved = data?.tokens_saved || 0
  const trend = data?.trend || 0

  return (
    <Card className={cn("shadow-sm")}>
      <CardHeader>
        <CardTitle className="text-lg">RTK Economy Health</CardTitle>
        <p className="text-sm text-muted-foreground">Current token savings efficiency</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              data={[{ name: "economy", value: savingsPct, fill: savingsPct >= 60 ? "#22c55e" : savingsPct >= 40 ? "#eab308" : "#ef4444" }]}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill="#22c55e"
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="bottom"
                align="center"
                formatter={(value: string) => <span className="text-sm text-muted-foreground">{value}</span>}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        {/* Center label overlay */}
        <div className="relative -mt-[250px] flex flex-col items-center justify-center h-[200px] pointer-events-none">
          <span className="text-3xl font-bold">{savingsPct.toFixed(1)}%</span>
          <span className="text-sm text-muted-foreground">Token Savings</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Trend</p>
            <p className={`text-lg font-semibold ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tokens Saved</p>
            <p className="text-lg font-semibold">{tokensSaved.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className={`text-lg font-semibold ${savingsPct >= 60 ? "text-green-600" : savingsPct >= 40 ? "text-yellow-600" : "text-red-600"}`}>
              {savingsPct >= 60 ? "Healthy" : savingsPct >= 40 ? "Caution" : "Critical"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
