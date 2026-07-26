import { useParams } from 'react-router-dom'
import { useTicket } from '../hooks/useTicket'
import { CommentList } from '../../comments/components/CommentList'
import { TicketActions } from './TicketActions'
import { SlaStatus } from '../../sla/components/SlaStatus'
import { AttachmentList } from '../../attachments/components/AttachmentList'

export function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const ticketId = Number(id)

  const { data: ticket, isLoading, isError } = useTicket(ticketId)

  if (isLoading) return <p>Loading ticket...</p>
  if (isError || !ticket) return <p>Ticket not found.</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{ticket.subject}</h1>
      <p>{ticket.description}</p>
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Category: {ticket.category ?? 'Uncategorized'}</p>
      <p>Requester: {ticket.requester.name}</p>
      <p>Assignee: {ticket.assignee?.name ?? 'Unassigned'}</p>
      <p>Created: {new Date(ticket.createdAt).toLocaleString()}</p>
      <SlaStatus ticketId={ticket.id} />
      <AttachmentList ticketId={ticket.id} />
      <TicketActions ticket={ticket} />
      <CommentList ticketId={ticketId} />
    </div>
  )
}