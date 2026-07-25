import type { UserResponse } from '../users/types'

export type CommentType = "REPLY" | "NOTE" | "RESOLUTION"

export interface CommentResponse {
  id: number
  ticketId: number
  author: UserResponse
  parentId: number | null
  body: string
  internal: boolean
  type: CommentType
  createdAt: string
  replies: CommentResponse[]
}

export interface PageCommentResponse {
  totalElements: number
  totalPages: number
  size: number
  content: CommentResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}