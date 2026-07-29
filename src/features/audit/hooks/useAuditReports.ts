import { useQuery } from '@tanstack/react-query'
import { getAuthLogs, getLogsByActor, getLogsByAction } from '../api/auditApi'
import type { AuditAction } from '../types'

export function useAuthLogs(page = 0, size = 20) {
  return useQuery({
    queryKey: ['audit', 'auth', page, size],
    queryFn: () => getAuthLogs(page, size),
  })
}

export function useLogsByActor(actorId: number | null, page = 0, size = 20) {
  return useQuery({
    queryKey: ['audit', 'actor', actorId, page, size],
    queryFn: () => getLogsByActor(actorId!, page, size),
    enabled: actorId !== null,
  })
}

export function useLogsByAction(action: AuditAction | null, page = 0, size = 20) {
  return useQuery({
    queryKey: ['audit', 'action', action, page, size],
    queryFn: () => getLogsByAction(action!, page, size),
    enabled: action !== null,
  })
}