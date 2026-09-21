import type { AuditLogResponse } from '../types'
import { formatAction } from '../utils/formatAction'
import { ArrowRight } from 'lucide-react'

/**
 * Pure rendering of a fetched audit log list, shared between AuditTrail (tickets) and
 * AssetAuditTrail (assets) so the two entity types don't diverge in how entries are displayed.
 */
export function AuditLogList({ logs, emptyMessage }: { logs: AuditLogResponse[]; emptyMessage: string }) {
  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
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
            <p className="text-xs mt-1 flex items-center gap-1.5 font-mono text-muted-foreground">
              <span>{log.oldValue}</span>
              <ArrowRight className="h-3 w-3 shrink-0 text-foreground" />
              <span>{log.newValue}</span>
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
