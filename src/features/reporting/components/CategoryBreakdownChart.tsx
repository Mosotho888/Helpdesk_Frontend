import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { CategoryBreakdownReportRow } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CategoryBreakdownChart({ data }: { data: CategoryBreakdownReportRow[] }) {
  const chartData = data.filter((row) => row.ticketCount > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tickets by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categorised tickets yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(chartData.length * 40, 200)}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="categoryName"
                tick={{ fontSize: 12 }}
                width={140}
              />
              <Tooltip />
              <Bar dataKey="ticketCount" fill="#3b82f6" name="Tickets" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
