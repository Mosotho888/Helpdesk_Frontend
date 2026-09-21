import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getArticlesForTicket, linkArticleToTicket, unlinkArticleFromTicket } from '../api/articleApi'

export function useTicketArticles(ticketId: number) {
  return useQuery({
    queryKey: ['tickets', ticketId, 'knowledge-articles'],
    queryFn: () => getArticlesForTicket(ticketId),
    enabled: !!ticketId,
  })
}

export function useLinkArticleToTicket(ticketId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (articleId: number) => linkArticleToTicket(ticketId, articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'knowledge-articles'] })
      queryClient.invalidateQueries({ queryKey: ['audit', 'ticket', ticketId] })
    },
  })
}

export function useUnlinkArticleFromTicket(ticketId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (articleId: number) => unlinkArticleFromTicket(ticketId, articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'knowledge-articles'] })
      queryClient.invalidateQueries({ queryKey: ['audit', 'ticket', ticketId] })
    },
  })
}
