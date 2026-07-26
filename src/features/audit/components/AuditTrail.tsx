import { useTicketAuditLogs } from '../hooks/useTicketAuditLogs'

function formatAction(action: string): string {
  return action
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

export function AuditTrail({ ticketId }: { ticketId: number }) {
  const { data: logs, isLoading, isError } = useTicketAuditLogs(ticketId)

  if (isLoading) return <p>Loading audit trail...</p>
  if (isError) return null // Admin/Agent-only endpoint — fail quietly for USER-role viewers

  return (
    <div style={{ margin: '1rem 0' }}>
      <h3>Audit Trail</h3>
      {logs && logs.length > 0 ? (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <strong>{formatAction(log.action)}</strong> by {log.actorName} ({log.actorRole})
              {' — '}{new Date(log.createdAt).toLocaleString()}
              {log.description && <p style={{ margin: '0.25rem 0', color: '#555' }}>{log.description}</p>}
              {log.oldValue && log.newValue && (
                <p style={{ margin: '0.25rem 0', fontSize: '0.9em' }}>
                  {log.oldValue} → {log.newValue}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No audit history yet.</p>
      )}
    </div>
  )
}