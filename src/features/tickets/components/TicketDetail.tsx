import { useParams } from 'react-router-dom'
import { useTicket } from '../hooks/useTicket'
import { getStatusBadgeClasses, getPriorityBadgeClasses } from '../utils/badgeVariants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SlaStatus } from '../../sla/components/SlaStatus'
import { AttachmentList } from '../../attachments/components/AttachmentList'
import { TicketActions } from './TicketActions'
import { CommentList } from '../../comments/components/CommentList'
import { AuditTrail } from '../../audit/components/AuditTrail'
import { LinkedAssets } from '../../assets/components/LinkedAssets'
import { useAuth } from '../../auth/context/useAuth'

export function TicketDetail() {
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const ticketId = Number(id)

  const isAuthorized = ['ADMIN', 'AGENT'].includes(user?.role ?? '');

  const { data: ticket, isLoading, isError } = useTicket(ticketId)

  if (isLoading) return <p className="p-6 text-muted-foreground">Loading ticket...</p>
  if (isError || !ticket) return <p className="p-6 text-destructive">Ticket not found.</p>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl">{ticket.subject}</CardTitle>
            <div className="flex gap-2 shrink-0">
              <Badge className={getStatusBadgeClasses(ticket.status)}>
                {ticket.status.replace('_', ' ')}
              </Badge>
              <Badge className={getPriorityBadgeClasses(ticket.priority)}>
                {ticket.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-base text-foreground">{ticket.description}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground pt-2 border-t">
            <p><span className="font-medium text-foreground">Category:</span> {ticket.category?.path ?? 'Uncategorized'}</p>
            <p><span className="font-medium text-foreground">Requester:</span> {ticket.requester.name}</p>
            <p><span className="font-medium text-foreground">Assignee:</span> {ticket.assignee?.name ?? 'Unassigned'}</p>
            <p><span className="font-medium text-foreground">Created:</span> {new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
      {isAuthorized && (
        <SlaStatus ticketId={ticket.id} />
      )}
      {isAuthorized && (
        <TicketActions ticket={ticket} />
      )}
      {isAuthorized && (
        <LinkedAssets ticketId={ticket.id} />
      )}
      <AttachmentList ticketId={ticket.id} />
      <CommentList ticketId={ticket.id} />
      {isAuthorized && (
        <AuditTrail ticketId={ticket.id} />
      )}
    </div>
  )
}