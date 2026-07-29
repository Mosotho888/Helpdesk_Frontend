import apiClient from '../../../shared/lib/axiosClient'
import type { PageAgentResponse, AgentResponse, CreateAgentRequest, UpdateAgentRequest, AgentStatsResponse } from '../types'

export async function getAgents(page = 0, size = 100): Promise<PageAgentResponse> {
  const response = await apiClient.get<PageAgentResponse>('/agents', {
    params: { page, size },
  })
  return response.data
}

export async function createAgent(payload: CreateAgentRequest): Promise<AgentResponse> {
  const response = await apiClient.post<AgentResponse>('/agents', payload)
  return response.data
}

export async function updateAgent(agentId: number, payload: UpdateAgentRequest): Promise<AgentResponse> {
  const response = await apiClient.patch<AgentResponse>(`/agents/${agentId}`, payload)
  return response.data
}

export async function getAgentStats(agentId: number): Promise<AgentStatsResponse> {
  const response = await apiClient.get<AgentStatsResponse>(`/agents/${agentId}/stats`)
  return response.data
}