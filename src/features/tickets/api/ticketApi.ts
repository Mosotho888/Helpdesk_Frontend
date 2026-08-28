import apiClient from '../../../shared/lib/axiosClient'
import type { PageTicketResponse, TicketResponse, TicketStatus, TicketPriority, CreateTicketRequest, UpdateTicketRequest } from '../types'

interface GetTicketsParams {
  status?: TicketStatus
  priority?: TicketPriority
  assigneeId?: number
  categoryId?: number
  includeDescendants?: boolean
  page?: number
  size?: number
  sort?: string[]
}

interface UpdateTicketParams {
  id: number
  payload: UpdateTicketRequest
}

export async function getTickets(params: GetTicketsParams = {}): Promise<PageTicketResponse> {
  const response = await apiClient.get<PageTicketResponse>('/tickets', {
    params: {
      status: params.status,
      priority: params.priority,
      assigneeId: params.assigneeId,
      categoryId: params.categoryId,
      includeDescendants: params.includeDescendants,
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

export async function createTicket(payload: CreateTicketRequest): Promise<TicketResponse> {
  const response = await apiClient.post<TicketResponse>('/tickets', payload)
  return response.data
}

export async function updateTicket({ id, payload }: UpdateTicketParams): Promise<TicketResponse> {
  const response = await apiClient.patch<TicketResponse>(`/tickets/${id}`, payload)
  return response.data
}
