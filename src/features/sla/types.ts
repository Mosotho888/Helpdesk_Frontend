export interface TicketSlaResponse {
  responseDueAt: string
  resolutionDueAt: string
  firstResponseAt: string | null
  resolvedAt: string | null
  responseBreached: boolean
  resolutionBreached: boolean
  status: string
}