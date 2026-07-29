import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAgents, createAgent, updateAgent, getAgentStats } from '../api/agentApi'
import type { CreateAgentRequest, UpdateAgentRequest } from '../types'

export function useAgentsList(page = 0, size = 20) {
  return useQuery({
    queryKey: ['agents', 'list', page, size],
    queryFn: () => getAgents(page, size),
  })
}

export function useCreateAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAgentRequest) => createAgent(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  })
}

export function useUpdateAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ agentId, payload }: { agentId: number; payload: UpdateAgentRequest }) =>
      updateAgent(agentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  })
}

export function useAgentStats(agentId: number, enabled: boolean) {
  return useQuery({
    queryKey: ['agents', 'stats', agentId],
    queryFn: () => getAgentStats(agentId),
    enabled,
  })
}