import apiClient from '../../../shared/lib/axiosClient'
import type { AuditLogResponse } from '../types'

export async function getTicketAuditLogs(ticketId: number): Promise<AuditLogResponse[]> {
  const response = await apiClient.get<AuditLogResponse[]>(`/audit/tickets/${ticketId}`)
  return response.data
}