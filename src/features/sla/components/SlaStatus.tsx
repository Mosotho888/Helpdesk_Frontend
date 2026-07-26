import { useTicketSla } from '../hooks/useTicketSla'

export function SlaStatus({ ticketId }: { ticketId: number }) {
  const { data, isLoading, isError } = useTicketSla(ticketId)

  if (isLoading) return <p>Loading SLA status...</p>
  if (isError || !data) return null // some tickets/roles may not have SLA visibility — fail quietly

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <h3>SLA Status</h3>
      <p>
        Response due: {new Date(data.responseDueAt).toLocaleString()}
        {data.responseBreached && <strong style={{ color: 'red' }}> - BREACHED</strong>}
      </p>
      <p>
        Resolution due: {new Date(data.resolutionDueAt).toLocaleString()}
        {data.resolutionBreached && <strong style={{ color: 'red' }}> - BREACHED</strong>}
      </p>
      {data.firstResponseAt && (
        <p>First response: {new Date(data.firstResponseAt).toLocaleString()}</p>
      )}
      {data.resolvedAt && (
        <p>Resolved: {new Date(data.resolvedAt).toLocaleString()}</p>
      )}
    </div>
  )
}