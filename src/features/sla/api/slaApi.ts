import apiClient from '../../../shared/lib/axiosClient'
import type { TicketSlaResponse } from '../types'

export async function getTicketSla(ticketId: number): Promise<TicketSlaResponse> {
  const response = await apiClient.get<TicketSlaResponse>(`/tickets/${ticketId}/sla`)
  return response.data
}