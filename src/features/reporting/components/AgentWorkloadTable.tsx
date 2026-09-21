import type { AgentWorkloadReportRow } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

function getAvailabilityBadgeClasses(availability: string): string {
  switch (availability) {
    case 'ONLINE':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'BUSY':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'AWAY':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    default:
      return 'bg-gray-100 text-gray-500 border-gray-200'
  }
}

export function AgentWorkloadTable({ data }: { data: AgentWorkloadReportRow[] }) {
  const sorted = [...data].sort(
    (a, b) => b.openCount + b.inProgressCount - (a.openCount + a.inProgressCount)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Agent Workload</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">No agents registered yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Open</TableHead>
                <TableHead className="text-right">In Progress</TableHead>
                <TableHead className="text-right">Escalated</TableHead>
                <TableHead className="text-right">Resolved</TableHead>
                <TableHead className="text-right">Avg Resolution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((row) => (
                <TableRow key={row.agentId}>
                  <TableCell>
                    <div className="font-medium">{row.agentName}</div>
                    {row.department && (
                      <div className="text-xs text-muted-foreground">{row.department}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getAvailabilityBadgeClasses(row.availability)}>
                      {row.availability}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{row.openCount}</TableCell>
                  <TableCell className="text-right">{row.inProgressCount}</TableCell>
                  <TableCell className="text-right">{row.escalatedCount}</TableCell>
                  <TableCell className="text-right">{row.resolvedCount + row.closedCount}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.avgResolutionHours != null ? `${row.avgResolutionHours.toFixed(1)}h` : 'n/a'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
