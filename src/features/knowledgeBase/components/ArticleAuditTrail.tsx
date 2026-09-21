import { useArticleAuditLogs } from '../../audit/hooks/useArticleAuditLogs'
import { AuditLogList } from '../../audit/components/AuditLogList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ArticleAuditTrail({ articleId }: { articleId: number }) {
  const { data: logs, isLoading, isError } = useArticleAuditLogs(articleId)

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading audit trail...</p>
  if (isError) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Audit Trail</CardTitle>
      </CardHeader>
      <CardContent>
        <AuditLogList logs={logs ?? []} emptyMessage="No changes recorded for this article yet." />
      </CardContent>
    </Card>
  )
}
