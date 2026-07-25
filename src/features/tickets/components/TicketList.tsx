import { useTickets } from '../hooks/useTickets'

export function TicketList() {
  const { data, isLoading, isError, error } = useTickets({ page: 0, size: 20 })

  if (isLoading) return <p>Loading tickets...</p>
  if (isError) return <p>Error: {error instanceof Error ? error.message : 'Failed to load tickets'}</p>

  return (
    <div>
      <h2>Tickets ({data?.totalElements ?? 0})</h2>
      <ul>
        {data?.content.map((ticket) => (
          <li key={ticket.id}>
            <strong>{ticket.subject}</strong> — {ticket.status} — {ticket.priority}
            {ticket.assignee ? ` — assigned to ${ticket.assignee.name}` : ' — unassigned'}
          </li>
        ))}
      </ul>
    </div>
  )
}