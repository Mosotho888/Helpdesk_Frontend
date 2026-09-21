import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { SlaComplianceReportRow } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SlaComplianceChart({ data }: { data: SlaComplianceReportRow[] }) {
  const hasData = data.some((row) => row.totalCount > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">SLA Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="text-sm text-muted-foreground">No SLA records in this period.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reportDate" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Compliance'] as [string, string]}
              />
              <Line
                type="monotone"
                dataKey="complianceRate"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Compliance rate"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
