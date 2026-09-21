export type ArticleType = 'TROUBLESHOOTING_GUIDE' | 'FAQ' | 'STANDARD_OPERATING_PROCEDURE' | 'GENERAL'

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface ArticleSummaryResponse {
  id: number
  title: string
  slug: string
  summary: string | null
  type: ArticleType
  status: ArticleStatus
  categoryName: string | null
  tags: string[]
  authorName: string
  viewCount: number
  helpfulCount: number
  notHelpfulCount: number
  usageCount: number
  publishedAt: string | null
  updatedAt: string
}

export interface ArticleResponse {
  id: number
  title: string
  slug: string
  summary: string | null
  content: string
  type: ArticleType
  status: ArticleStatus
  categoryId: number | null
  categoryName: string | null
  authorId: number
  authorName: string
  tags: string[]
  viewCount: number
  helpfulCount: number
  notHelpfulCount: number
  usageCount: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PageArticleSummaryResponse {
  totalElements: number
  totalPages: number
  size: number
  content: ArticleSummaryResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

export interface CreateArticleRequest {
  title: string
  summary?: string
  content: string
  type: ArticleType
  categoryId?: number
  tags?: string[]
}

export interface UpdateArticleRequest {
  title?: string
  summary?: string
  content?: string
  type?: ArticleType
  status?: ArticleStatus
  categoryId?: number
  clearCategory?: boolean
  tags?: string[]
}

export interface ArticleFeedbackRequest {
  helpful: boolean
}

export interface ArticleFeedbackResponse {
  articleId: number
  helpfulCount: number
  notHelpfulCount: number
  yourVote: boolean | null
}

export interface TicketArticleLinkResponse {
  ticketId: number
  articleId: number
  articleTitle: string
  linkedByName: string
  linkedAt: string
}

export interface ArticleTicketHistoryResponse {
  ticketId: number
  subject: string
  status: string
  linkedAt: string
}

export interface PageArticleTicketHistoryResponse {
  totalElements: number
  totalPages: number
  size: number
  content: ArticleTicketHistoryResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}
