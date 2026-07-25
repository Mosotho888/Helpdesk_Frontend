import apiClient from '../../../shared/lib/axiosClient'
import type { PageCommentResponse, CommentResponse, CommentType } from '../types'

export async function getComments(ticketId: number, page = 0, size = 20): Promise<PageCommentResponse> {
  const response = await apiClient.get<PageCommentResponse>(`/tickets/${ticketId}/comments`, {
    params: { page, size },
  })
  return response.data
}

interface CreateCommentParams {
  ticketId: number
  body: string
  internal?: boolean
  type?: CommentType
}

export async function addComment({ ticketId, body, internal, type }: CreateCommentParams): Promise<CommentResponse> {
  const response = await apiClient.post<CommentResponse>(`/tickets/${ticketId}/comments`, {
    body,
    internal,
    type,
  })
  return response.data
}