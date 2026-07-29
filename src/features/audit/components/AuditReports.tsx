import { useState } from 'react'
import { useAuthLogs, useLogsByActor, useLogsByAction } from '../hooks/useAuditReports'
import { useUsers } from '../../users/hooks/useUsers'
import { formatAction } from '../utils/formatAction'
import type { AuditAction, AuditLogResponse } from '../types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const ALL_ACTIONS: AuditAction[] = [
  'TICKET_CREATED', 'STATUS_CHANGED', 'ASSIGNED_TO_AGENT', 'ESCALATED',
  'PRIORITY_CHANGED', 'TICKET_DELETED', 'TICKET_CLOSED',
  'USER_CREATED', 'USER_UPDATED', 'USER_DEACTIVATED', 'USER_REACTIVATED',
  'ROLE_CHANGED', 'PASSWORD_RESET',
  'AGENT_REGISTERED', 'AVAILABILITY_CHANGED', 'DEPARTMENT_CHANGED',
  'COMMENT_ADDED', 'COMMENT_EDITED', 'COMMENT_DELETED', 'INTERNAL_NOTE_ADDED',
  'ATTACHMENT_UPLOADED', 'ATTACHMENT_DELETED', 'ATTACHMENT_DOWNLOADED',
  'LOGIN_SUCCESS', 'LOGIN_FAILED', 'ACCOUNT_LOCKED', 'TOKEN_REFRESHED', 'FORCED_LOGOUT',
]

type ReportType = 'AUTH' | 'BY_ACTOR' | 'BY_ACTION'

function LogRow({ log }: { log: AuditLogResponse }) {
  return (
    <li className="text-sm border-b pb-2 last:border-0 last:pb-0">
      <span className="font-medium">{formatAction(log.action)}</span>
      <span className="text-muted-foreground"> by {log.actorName} ({log.actorRole}) - {log.ipAddress}</span>
      <span className="text-xs text-muted-foreground block">
        {new Date(log.createdAt).toLocaleString()}
      </span>
      {log.description && <p className="text-muted-foreground mt-1">{log.description}</p>}
    </li>
  )
}

export function AuditReports() {
  const [reportType, setReportType] = useState<ReportType>('AUTH')
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState<AuditAction | null>(null)
  const [page, setPage] = useState(0)

  const { data: usersData } = useUsers(0, 100)

  const authLogs = useAuthLogs(page)
  const actorLogs = useLogsByActor(selectedActorId ? Number(selectedActorId) : null, page)
  const actionLogs = useLogsByAction(selectedAction, page)

  const activeQuery =
    reportType === 'AUTH' ? authLogs : reportType === 'BY_ACTOR' ? actorLogs : actionLogs

  function handleReportTypeChange(value: string | null) {
    if (!value) return
    setReportType(value as ReportType)
    setPage(0)
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Audit Reports</h1>

      <div className="flex gap-4">
        <Select value={reportType} onValueChange={handleReportTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AUTH">Authentication Events</SelectItem>
            <SelectItem value="BY_ACTOR">By User</SelectItem>
            <SelectItem value="BY_ACTION">By Action Type</SelectItem>
          </SelectContent>
        </Select>

        {reportType === 'BY_ACTOR' && (
          <Select value={selectedActorId ?? ''} onValueChange={(v) => { setSelectedActorId(v); setPage(0) }}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {usersData?.content.map((u) => (
                <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {reportType === 'BY_ACTION' && (
          <Select value={selectedAction ?? ''} onValueChange={(v) => { setSelectedAction(v as AuditAction); setPage(0) }}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              {ALL_ACTIONS.map((action) => (
                <SelectItem key={action} value={action}>{formatAction(action)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          {activeQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : activeQuery.data && activeQuery.data.content.length > 0 ? (
            <ul className="space-y-3">
              {activeQuery.data.content.map((log) => <LogRow key={log.id} log={log} />)}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              {reportType !== 'AUTH' && !selectedActorId && !selectedAction
                ? 'Select a filter above to view results.'
                : 'No audit events found.'}
            </p>
          )}
        </CardContent>
      </Card>

      {activeQuery.data && (
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={activeQuery.data.first}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page + 1} of {activeQuery.data.totalPages}</span>
          <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={activeQuery.data.last}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}