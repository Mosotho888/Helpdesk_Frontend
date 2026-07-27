import { useTicketAuditLogs } from '../hooks/useTicketAuditLogs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAction } from '../utils/formatAction'

export function AuditTrail({ ticketId }: { ticketId: number }) {
  const { data: logs, isLoading, isError } = useTicketAuditLogs(ticketId)

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading audit trail...</p>
  if (isError) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Audit Trail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {logs && logs.length > 0 ? (
          <ul className="space-y-3">
            {logs.map((log) => (
              <li key={log.id} className="text-sm border-b pb-2 last:border-0 last:pb-0">
                <span className="font-medium">{formatAction(log.action)}</span>
                <span className="text-muted-foreground"> by {log.actorName} ({log.actorRole})</span>
                <span className="text-xs text-muted-foreground block">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
                {log.description && <p className="text-muted-foreground mt-1">{log.description}</p>}
                {log.oldValue && log.newValue && (
                  <p className="text-xs mt-1">{log.oldValue} → {log.newValue}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No audit history yet.</p>
        )}
      </CardContent>
    </Card>
  )
}