import apiClient from '../../../shared/lib/axiosClient'
import type {
  TicketVolumeReportRow,
  SlaComplianceReportRow,
  AgentWorkloadReportRow,
  CategoryBreakdownReportRow,
  AssetSummaryReportRow,
  KnowledgeBaseEffectivenessReportRow,
} from '../types'

export async function getTicketVolume(days: number): Promise<TicketVolumeReportRow[]> {
  const response = await apiClient.get<TicketVolumeReportRow[]>('/reports/ticket-volume', {
    params: { days },
  })
  return response.data
}

export async function getSlaCompliance(days: number): Promise<SlaComplianceReportRow[]> {
  const response = await apiClient.get<SlaComplianceReportRow[]>('/reports/sla-compliance', {
    params: { days },
  })
  return response.data
}

export async function getAgentWorkload(): Promise<AgentWorkloadReportRow[]> {
  const response = await apiClient.get<AgentWorkloadReportRow[]>('/reports/agent-workload')
  return response.data
}

export async function getCategoryBreakdown(): Promise<CategoryBreakdownReportRow[]> {
  const response = await apiClient.get<CategoryBreakdownReportRow[]>('/reports/category-breakdown')
  return response.data
}

export async function getAssetSummary(): Promise<AssetSummaryReportRow[]> {
  const response = await apiClient.get<AssetSummaryReportRow[]>('/reports/assets')
  return response.data
}

export async function getKnowledgeBaseEffectiveness(): Promise<KnowledgeBaseEffectivenessReportRow[]> {
  const response = await apiClient.get<KnowledgeBaseEffectivenessReportRow[]>('/reports/knowledge-base')
  return response.data
}

export async function refreshReports(): Promise<void> {
  await apiClient.post('/reports/refresh')
}
