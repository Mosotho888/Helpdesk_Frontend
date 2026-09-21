import apiClient from '../../../shared/lib/axiosClient'
import type {
  ArticleResponse,
  ArticleSummaryResponse,
  ArticleType,
  ArticleStatus,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleFeedbackRequest,
  ArticleFeedbackResponse,
  PageArticleSummaryResponse,
  PageArticleTicketHistoryResponse,
  TicketArticleLinkResponse,
} from '../types'

interface GetArticlesParams {
  status?: ArticleStatus
  type?: ArticleType
  categoryId?: number
  tag?: string
  page?: number
  size?: number
}

export async function getArticles(params: GetArticlesParams = {}): Promise<PageArticleSummaryResponse> {
  const response = await apiClient.get<PageArticleSummaryResponse>('/knowledge-base', {
    params: {
      status: params.status,
      type: params.type,
      categoryId: params.categoryId,
      tag: params.tag,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  })
  return response.data
}

export async function searchArticles(
  query: string,
  page = 0,
  size = 20
): Promise<PageArticleSummaryResponse> {
  const response = await apiClient.get<PageArticleSummaryResponse>('/knowledge-base/search', {
    params: { q: query, page, size },
  })
  return response.data
}

export async function getArticle(id: number): Promise<ArticleResponse> {
  const response = await apiClient.get<ArticleResponse>(`/knowledge-base/${id}`)
  return response.data
}

export async function getArticleBySlug(slug: string): Promise<ArticleResponse> {
  const response = await apiClient.get<ArticleResponse>(`/knowledge-base/slug/${slug}`)
  return response.data
}

export async function createArticle(payload: CreateArticleRequest): Promise<ArticleResponse> {
  const response = await apiClient.post<ArticleResponse>('/knowledge-base', payload)
  return response.data
}

export async function updateArticle(id: number, payload: UpdateArticleRequest): Promise<ArticleResponse> {
  const response = await apiClient.patch<ArticleResponse>(`/knowledge-base/${id}`, payload)
  return response.data
}

export async function deleteArticle(id: number): Promise<void> {
  await apiClient.delete(`/knowledge-base/${id}`)
}

export async function submitFeedback(
  id: number,
  payload: ArticleFeedbackRequest
): Promise<ArticleFeedbackResponse> {
  const response = await apiClient.post<ArticleFeedbackResponse>(`/knowledge-base/${id}/feedback`, payload)
  return response.data
}

export async function getFeedback(id: number): Promise<ArticleFeedbackResponse> {
  const response = await apiClient.get<ArticleFeedbackResponse>(`/knowledge-base/${id}/feedback`)
  return response.data
}

export async function getArticleTicketHistory(
  id: number,
  page = 0,
  size = 20
): Promise<PageArticleTicketHistoryResponse> {
  const response = await apiClient.get<PageArticleTicketHistoryResponse>(`/knowledge-base/${id}/tickets`, {
    params: { page, size },
  })
  return response.data
}

// Ticket <-> article linking

export async function getArticlesForTicket(ticketId: number): Promise<ArticleSummaryResponse[]> {
  const response = await apiClient.get<ArticleSummaryResponse[]>(`/tickets/${ticketId}/knowledge-articles`)
  return response.data
}

export async function linkArticleToTicket(
  ticketId: number,
  articleId: number
): Promise<TicketArticleLinkResponse> {
  const response = await apiClient.post<TicketArticleLinkResponse>(
    `/tickets/${ticketId}/knowledge-articles/${articleId}`
  )
  return response.data
}

export async function unlinkArticleFromTicket(ticketId: number, articleId: number): Promise<void> {
  await apiClient.delete(`/tickets/${ticketId}/knowledge-articles/${articleId}`)
}
