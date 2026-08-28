import type { UserResponse } from '../users/types'
import type { CategorySummaryResponse } from '../categories/types'

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED" | "CLOSED"
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

export interface TicketResponse {
  id: number
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: CategorySummaryResponse | null
  requester: UserResponse
  assignee: UserResponse | null
  escalated: boolean
  createdAt: string
  updatedAt: string
}

export interface PageTicketResponse {
  totalElements: number
  totalPages: number
  size: number
  content: TicketResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

export interface CreateTicketRequest {
  subject: string
  description: string
  priority?: TicketPriority
  categoryId?: number
  assigneeId?: number
  tags?: string[]
}

export interface UpdateTicketRequest {
  status?: TicketStatus
  priority?: TicketPriority
  categoryId?: number
  assigneeId?: number
  escalated?: boolean
  escalationReason?: string
}