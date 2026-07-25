import apiClient from '../../../shared/lib/axiosClient'
import type { PageTicketResponse, TicketResponse, TicketStatus, TicketPriority } from '../types'

interface GetTicketsParams {
  status?: TicketStatus
  priority?: TicketPriority
  assigneeId?: number
  page?: number
  size?: number
  sort?: string[]
}

export async function getTickets(params: GetTicketsParams = {}): Promise<PageTicketResponse> {
  const response = await apiClient.get<PageTicketResponse>('/tickets', {
    params: {
      status: params.status,
      priority: params.priority,
      assigneeId: params.assigneeId,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort,
    },
  })
  return response.data
}

export async function getTicket(id: number): Promise<TicketResponse> {
  const response = await apiClient.get<TicketResponse>(`/tickets/${id}`)
  return response.data
}