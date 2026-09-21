import { useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { AssetSummaryReportRow } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const STATUS_COLORS: Record<string, string> = {
  IN_USE: '#10b981',
  IN_STORAGE: '#6b7280',
  UNDER_REPAIR: '#f59e0b',
  RETIRED: '#9ca3af',
  LOST: '#ef4444',
}

const STATUS_ORDER = ['IN_USE', 'IN_STORAGE', 'UNDER_REPAIR', 'RETIRED', 'LOST']

function pivotByTypeAndStatus(rows: AssetSummaryReportRow[]) {
  const byType = new Map<string, Record<string, number>>()

  for (const row of rows) {
    const existing = byType.get(row.type) ?? {}
    existing[row.status] = row.assetCount
    byType.set(row.type, existing)
  }

  return Array.from(byType.entries()).map(([type, counts]) => ({ type, ...counts }))
}

export function AssetSummaryPanel({ data }: { data: AssetSummaryReportRow[] }) {
  const chartData = useMemo(() => pivotByTypeAndStatus(data), [data])
  const expiringSoon = data.filter((row) => row.warrantyExpiringSoonCount > 0)
  const expired = data.filter((row) => row.warrantyExpiredCount > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Asset Inventory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assets registered yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {STATUS_ORDER.map((status) => (
                <Bar
                  key={status}
                  dataKey={status}
                  stackId="1"
                  fill={STATUS_COLORS[status]}
                  name={status.replace('_', ' ')}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}

        {(expiringSoon.length > 0 || expired.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {expired.map((row) => (
              <Badge key={`expired-${row.type}-${row.status}`} className="bg-red-100 text-red-800 border-red-200">
                {row.warrantyExpiredCount} {row.type} warranty expired
              </Badge>
            ))}
            {expiringSoon.map((row) => (
              <Badge
                key={`expiring-${row.type}-${row.status}`}
                className="bg-amber-100 text-amber-800 border-amber-200"
              >
                {row.warrantyExpiringSoonCount} {row.type} warranty expiring soon
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
