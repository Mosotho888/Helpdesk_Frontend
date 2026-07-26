import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTicket } from '../api/ticketApi'
import { useAgents } from '../../agents/hooks/useAgents'
import type { TicketResponse, TicketStatus, TicketPriority } from '../types'

export function TicketActions({ ticket }: { ticket: TicketResponse }) {
  const queryClient = useQueryClient()
  const { data: agentsData, isLoading: agentsLoading } = useAgents()

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

  function handleAssigneeChange(value: string) {
    const assigneeId = value === '' ? undefined : Number(value)
    mutation.mutate({ id: ticket.id, payload: { assigneeId } })
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

      <div>
        <label htmlFor="assignee-select">Assignee</label>
        <select
          id="assignee-select"
          value={agentsData?.content.find((agent) => agent.user.id === ticket.assignee?.id)?.id ?? ''}
          onChange={(e) => handleAssigneeChange(e.target.value)}
          disabled={mutation.isPending || agentsLoading}
        >
          <option value="">Unassigned</option>
          {agentsData?.content.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.user.name}
            </option>
          ))}
        </select>
      </div>

      {mutation.isPending && <span>Saving...</span>}
      {mutation.isError && <span style={{ color: 'red' }}>Failed to update</span>}
    </div>
  )
}