import apiClient from '../../../shared/lib/axiosClient'
import type { PageAgentResponse } from '../types'

export async function getAgents(page = 0, size = 100): Promise<PageAgentResponse> {
  const response = await apiClient.get<PageAgentResponse>('/agents', {
    params: { page, size },
  })
  return response.data
}