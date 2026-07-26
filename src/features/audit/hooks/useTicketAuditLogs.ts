import { useQuery } from '@tanstack/react-query'
import { getTicketAuditLogs } from '../api/auditApi'

export function useTicketAuditLogs(ticketId: number) {
  return useQuery({
    queryKey: ['audit', 'ticket', ticketId],
    queryFn: () => getTicketAuditLogs(ticketId),
    enabled: !!ticketId,
  })
}