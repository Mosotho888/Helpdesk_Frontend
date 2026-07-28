import apiClient from '../../../shared/lib/axiosClient'
import type { PageCommentResponse, CommentResponse, CommentType } from '../types'

interface CreateCommentParams {
  ticketId: number
  body: string
  internal?: boolean
  type?: CommentType
}

export async function getComments(ticketId: number, page = 0, size = 20): Promise<PageCommentResponse> {
  const response = await apiClient.get<PageCommentResponse>(`/tickets/${ticketId}/comments`, {
    params: { page, size },
  })
  return response.data
}

export async function addComment({ ticketId, body, internal, type }: CreateCommentParams): Promise<CommentResponse> {
  const response = await apiClient.post<CommentResponse>(`/tickets/${ticketId}/comments`, {
    body,
    internal,
    type,
  })
  return response.data
}

export async function addReply(commentId: number, body: string, type?: CommentType, internal?: boolean): Promise<CommentResponse> {
  const response = await apiClient.post<CommentResponse>(`/comments/${commentId}/replies`, {
    body,
    type,
    internal,
  })
  return response.data
}