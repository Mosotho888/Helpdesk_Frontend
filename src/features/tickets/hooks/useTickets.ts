import { useQuery } from '@tanstack/react-query'
import { getTickets } from '../api/ticketApi'
import type { TicketStatus, TicketPriority } from '../types'

interface UseTicketsParams {
  status?: TicketStatus
  priority?: TicketPriority
  assigneeId?: number
  page?: number
  size?: number
  sort?: string[]
}

export function useTickets(params: UseTicketsParams = {}) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => getTickets(params),
  })
}