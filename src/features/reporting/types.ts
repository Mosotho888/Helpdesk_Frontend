export interface TicketVolumeReportRow {
  reportDate: string
  status: string
  priority: string
  ticketCount: number
}

export interface SlaComplianceReportRow {
  reportDate: string
  totalCount: number
  metCount: number
  breachedCount: number
  complianceRate: number | null
}

export interface AgentWorkloadReportRow {
  agentId: number
  agentName: string
  department: string | null
  availability: string
  openCount: number
  inProgressCount: number
  resolvedCount: number
  closedCount: number
  escalatedCount: number
  avgResolutionHours: number | null
}

export interface CategoryBreakdownReportRow {
  categoryId: number
  categoryName: string
  ticketCount: number
  avgResolutionHours: number | null
}

export interface AssetSummaryReportRow {
  type: string
  status: string
  assetCount: number
  warrantyExpiringSoonCount: number
  warrantyExpiredCount: number
}

export interface KnowledgeBaseEffectivenessReportRow {
  articleId: number
  title: string
  status: string
  viewCount: number
  helpfulCount: number
  notHelpfulCount: number
  usageCount: number
  helpfulRatio: number | null
}
