import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTicketVolume,
  getSlaCompliance,
  getAgentWorkload,
  getCategoryBreakdown,
  getAssetSummary,
  getKnowledgeBaseEffectiveness,
  refreshReports,
} from '../api/reportingApi'

export function useTicketVolumeReport(days: number) {
  return useQuery({
    queryKey: ['reports', 'ticket-volume', days],
    queryFn: () => getTicketVolume(days),
  })
}

export function useSlaComplianceReport(days: number) {
  return useQuery({
    queryKey: ['reports', 'sla-compliance', days],
    queryFn: () => getSlaCompliance(days),
  })
}

export function useAgentWorkloadReport() {
  return useQuery({
    queryKey: ['reports', 'agent-workload'],
    queryFn: getAgentWorkload,
  })
}

export function useCategoryBreakdownReport() {
  return useQuery({
    queryKey: ['reports', 'category-breakdown'],
    queryFn: getCategoryBreakdown,
  })
}

export function useAssetSummaryReport() {
  return useQuery({
    queryKey: ['reports', 'assets'],
    queryFn: getAssetSummary,
  })
}

export function useKnowledgeBaseEffectivenessReport() {
  return useQuery({
    queryKey: ['reports', 'knowledge-base'],
    queryFn: getKnowledgeBaseEffectiveness,
  })
}

export function useRefreshReports() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: refreshReports,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  })
}
