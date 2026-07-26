import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTicket } from '../api/ticketApi'
import type { TicketResponse, TicketStatus, TicketPriority } from '../types'

export function TicketActions({ ticket }: { ticket: TicketResponse }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateTicket,
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(['tickets', updatedTicket.id], updatedTicket)
      queryClient.invalidateQueries({ queryKey: ['tickets'], exact: false })
    },
  })

  function handleStatusChange(status: TicketStatus) {
    mutation.mutate({ id: ticket.id, payload: { status } })
  }

  function handlePriorityChange(priority: TicketPriority) {
    mutation.mutate({ id: ticket.id, payload: { priority } })
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
      <div>
        <label htmlFor="status-select">Status</label>
        <select
          id="status-select"
          value={ticket.status}
          onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
          disabled={mutation.isPending}
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ESCALATED">Escalated</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority-select">Priority</label>
        <select
          id="priority-select"
          value={ticket.priority}
          onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
          disabled={mutation.isPending}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {mutation.isPending && <span>Saving...</span>}
      {mutation.isError && <span style={{ color: 'red' }}>Failed to update</span>}
    </div>
  )
}