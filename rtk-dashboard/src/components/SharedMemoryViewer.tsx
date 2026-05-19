import { useSharedMemory } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function SharedMemoryViewer() {
  const { data, isLoading, error } = useSharedMemory()

  if (isLoading) return <div className="h-[200px] flex items-center justify-center">Loading memory data...</div>
  if (error) return <div className="text-destructive">Error loading shared memory</div>
  if (!data) return <div>No shared memory data available</div>

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Shared Memory</CardTitle>
        <p className="text-sm text-muted-foreground">Inter-agent memory across teams</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {data.teams.map((team: any) => (
            <div key={team.name} className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">{team.name}</h3>
                <Badge variant="outline">{team.entries} entries</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {team.name === "feature-team" ? "Frontend + Backend + QA" :
                 team.name === "infra-team" ? "DevOps + Security" :
                 "Data Engineer + Backend"}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-xs">Team</TableHead>
                <TableHead className="text-xs">Total Entries</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-sm">All Teams</TableCell>
                <TableCell className="text-sm font-medium">{data.totalEntries}</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    Active
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
