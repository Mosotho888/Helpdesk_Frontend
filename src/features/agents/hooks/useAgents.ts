import { useQuery } from '@tanstack/react-query'
import { getAgents } from '../api/agentApi'

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => getAgents(),
  })
}