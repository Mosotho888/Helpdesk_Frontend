import { Link } from 'react-router-dom'
import type { KnowledgeBaseEffectivenessReportRow } from '../types'
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

export function KnowledgeBaseEffectivenessTable({
  data,
}: {
  data: KnowledgeBaseEffectivenessReportRow[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Knowledge Base Effectiveness</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No articles yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Helpful</TableHead>
                <TableHead className="text-right">Used to Resolve</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.articleId}>
                  <TableCell>
                    <Link to={`/knowledge-base/${row.articleId}`} className="font-medium hover:underline">
                      {row.title}
                    </Link>
                    {row.status !== 'PUBLISHED' && (
                      <Badge variant="secondary" className="ml-2">
                        {row.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{row.viewCount}</TableCell>
                  <TableCell className="text-right">
                    {row.helpfulRatio != null ? `${row.helpfulRatio.toFixed(0)}%` : 'No votes yet'}
                  </TableCell>
                  <TableCell className="text-right">{row.usageCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
