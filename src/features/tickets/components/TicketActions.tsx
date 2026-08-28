import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTicket } from '../api/ticketApi'
import { useAgents } from '../../agents/hooks/useAgents'
import { CategorySelect } from '../../categories/components/CategorySelect'
import type { TicketResponse, TicketStatus, TicketPriority } from '../types'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAvailabilityBadgeClasses } from '../../agents/utils/badgeVariants'
import { Badge } from '@/components/ui/badge'

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

  function handleStatusChange(value: string | null) {
  if (!value) return
  mutation.mutate({ id: ticket.id, payload: { status: value as TicketStatus } })
}

function handlePriorityChange(value: string | null) {
  if (!value) return
  mutation.mutate({ id: ticket.id, payload: { priority: value as TicketPriority } })
}

function handleAssigneeChange(value: string | null) {
  if (!value || value === 'UNASSIGNED') {
    mutation.mutate({ id: ticket.id, payload: { assigneeId: undefined } })
    return
  }
  mutation.mutate({ id: ticket.id, payload: { assigneeId: Number(value) } })
}

function handleCategoryChange(categoryId: number | null) {
  if (categoryId == null) return // categories are only ever added/changed here, not cleared
  mutation.mutate({ id: ticket.id, payload: { categoryId } })
}

  const currentAgentId =
    agentsData?.content.find((agent) => agent.user.id === ticket.assignee?.id)?.id

  return (
    <Card>
      <CardContent className="flex flex-wrap gap-4 pt-6">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={ticket.status} onValueChange={handleStatusChange} disabled={mutation.isPending}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="ESCALATED">Escalated</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Priority</Label>
          <Select value={ticket.priority} onValueChange={handlePriorityChange} disabled={mutation.isPending}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Assignee</Label>
          <Select
            value={currentAgentId?.toString() ?? 'UNASSIGNED'}
            onValueChange={handleAssigneeChange}
            disabled={mutation.isPending || agentsLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
              {agentsData?.content.map((agent) => (
                <SelectItem key={agent.id} value={agent.id.toString()}>
                  <span className="flex items-center gap-2">
                    {agent.user.name}
                    <Badge className={`text-xs ${getAvailabilityBadgeClasses(agent.availability)}`}>
                      {agent.availability ?? 'OFFLINE'}
                    </Badge>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 w-[220px]">
          <Label>Category</Label>
          <CategorySelect
            value={ticket.category?.id ?? null}
            onChange={handleCategoryChange}
            noneLabel="Uncategorised"
            disabled={mutation.isPending}
          />
        </div>

        {mutation.isPending && <span className="text-sm text-muted-foreground self-end pb-2">Saving...</span>}
        {mutation.isError && <span className="text-sm text-destructive self-end pb-2">Failed to update</span>}
      </CardContent>
    </Card>
  )
}