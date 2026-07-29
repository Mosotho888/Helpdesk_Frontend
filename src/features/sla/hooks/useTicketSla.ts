import { useQuery } from '@tanstack/react-query'
import { getTicketSla } from '../api/slaApi'

export function useTicketSla(ticketId: number) {
  return useQuery({
    queryKey: ['sla', ticketId],
    queryFn: () => getTicketSla(ticketId),
    enabled: !!ticketId,
  })
}