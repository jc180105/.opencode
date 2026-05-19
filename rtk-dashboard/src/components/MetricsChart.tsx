import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useRtkMetrics } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MetricsChart() {
  const { data, isLoading, error } = useRtkMetrics()

  if (isLoading) return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  if (error) return <div className="h-[300px] flex items-center justify-center text-destructive">Error loading chart</div>
  if (!data?.history?.length) return <div className="h-[300px] flex items-center justify-center">No data available</div>

  const chartData = data.history.map((item: any) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  return (
    <Card className={cn("shadow-sm")}>
      <CardHeader>
        <CardTitle className="text-lg">RTK Savings History</CardTitle>
        <p className="text-sm text-muted-foreground">Daily token savings trend</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCommands" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="formattedDate"
              className="text-xs fill-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-xs fill-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="savings_pct"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSavings)"
              name="Savings %"
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="commands"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCommands)"
              name="Commands"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
