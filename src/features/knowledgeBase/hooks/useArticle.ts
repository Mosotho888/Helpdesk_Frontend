import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getArticle, getArticleBySlug, getFeedback, submitFeedback, getArticleTicketHistory } from '../api/articleApi'
import type { ArticleFeedbackRequest } from '../types'

export function useArticle(id: number) {
  return useQuery({
    queryKey: ['knowledge-base', 'article', id],
    queryFn: () => getArticle(id),
    enabled: !!id,
  })
}

export function useArticleBySlug(slug: string) {
  return useQuery({
    queryKey: ['knowledge-base', 'article', 'slug', slug],
    queryFn: () => getArticleBySlug(slug),
    enabled: !!slug,
  })
}

export function useArticleFeedback(articleId: number) {
  return useQuery({
    queryKey: ['knowledge-base', 'article', articleId, 'feedback'],
    queryFn: () => getFeedback(articleId),
    enabled: !!articleId,
  })
}

export function useSubmitFeedback(articleId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ArticleFeedbackRequest) => submitFeedback(articleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base', 'article', articleId, 'feedback'] })
      queryClient.invalidateQueries({ queryKey: ['knowledge-base', 'article', articleId] })
    },
  })
}

export function useArticleTicketHistory(articleId: number, page = 0) {
  return useQuery({
    queryKey: ['knowledge-base', 'article', articleId, 'tickets', page],
    queryFn: () => getArticleTicketHistory(articleId, page),
    enabled: !!articleId,
  })
}
