import type { UserResponse } from '../users/types'

export type AgentAvailability = "ONLINE" | "BUSY" | "AWAY" | "OFFLINE"

export interface AgentResponse {
  id: number
  user: UserResponse
  department: string | null
  availability: AgentAvailability | null
}

export interface PageAgentResponse {
  totalElements: number
  totalPages: number
  size: number
  content: AgentResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}