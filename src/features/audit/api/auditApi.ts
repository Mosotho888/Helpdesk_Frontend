import apiClient from '../../../shared/lib/axiosClient'
import type { AuditLogResponse, PageAuditLogResponse, AuditAction  } from '../types'

export async function getTicketAuditLogs(ticketId: number): Promise<AuditLogResponse[]> {
  const response = await apiClient.get<AuditLogResponse[]>(`/audit/tickets/${ticketId}`)
  return response.data
}

export async function getAuthLogs(page = 0, size = 20): Promise<PageAuditLogResponse> {
  const response = await apiClient.get<PageAuditLogResponse>('/audit/auth', {
    params: { page, size },
  })
  return response.data
}

export async function getLogsByActor(actorId: number, page = 0, size = 20): Promise<PageAuditLogResponse> {
  const response = await apiClient.get<PageAuditLogResponse>(`/audit/actor/${actorId}`, {
    params: { page, size },
  })
  return response.data
}

export async function getLogsByAction(action: AuditAction, page = 0, size = 20): Promise<PageAuditLogResponse> {
  const response = await apiClient.get<PageAuditLogResponse>(`/audit/action/${action}`, {
    params: { page, size },
  })
  return response.data
}