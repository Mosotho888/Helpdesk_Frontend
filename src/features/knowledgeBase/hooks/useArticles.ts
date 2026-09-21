import { useQuery } from '@tanstack/react-query'
import { getArticles, searchArticles } from '../api/articleApi'
import type { ArticleType, ArticleStatus } from '../types'

interface UseArticlesParams {
  status?: ArticleStatus
  type?: ArticleType
  categoryId?: number
  tag?: string
  page?: number
  size?: number
}

export function useArticles(params: UseArticlesParams = {}) {
  return useQuery({
    queryKey: ['knowledge-base', 'articles', params],
    queryFn: () => getArticles(params),
  })
}

export function useArticleSearch(query: string, page = 0) {
  return useQuery({
    queryKey: ['knowledge-base', 'search', query, page],
    queryFn: () => searchArticles(query, page),
    enabled: query.trim().length > 0,
  })
}
