import { useQuery } from '@tanstack/react-query'
import { getTicket } from '../api/ticketApi'

export function useTicket(id: number) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => getTicket(id),
    enabled: !!id,
  })
}