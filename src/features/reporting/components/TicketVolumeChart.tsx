import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { TicketVolumeReportRow } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  OPEN: '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  ESCALATED: '#ef4444',
  RESOLVED: '#10b981',
  CLOSED: '#6b7280',
}

const STATUS_ORDER = ['OPEN', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED']

/** Pivots (date, status, priority, count) rows into one row per date with a column per status. */
function pivotByDateAndStatus(rows: TicketVolumeReportRow[]) {
  const byDate = new Map<string, Record<string, number>>()

  for (const row of rows) {
    const existing = byDate.get(row.reportDate) ?? {}
    existing[row.status] = (existing[row.status] ?? 0) + row.ticketCount
    byDate.set(row.reportDate, existing)
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([reportDate, counts]) => ({ reportDate, ...counts }))
}

export function TicketVolumeChart({ data }: { data: TicketVolumeReportRow[] }) {
  const chartData = useMemo(() => pivotByDateAndStatus(data), [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ticket Volume</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tickets in this period.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reportDate" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {STATUS_ORDER.map((status) => (
                <Area
                  key={status}
                  type="monotone"
                  dataKey={status}
                  stackId="1"
                  stroke={STATUS_COLORS[status]}
                  fill={STATUS_COLORS[status]}
                  fillOpacity={0.6}
                  name={status.replace('_', ' ')}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
