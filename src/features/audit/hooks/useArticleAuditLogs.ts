import { useQuery } from '@tanstack/react-query'
import { getArticleAuditLogs } from '../api/auditApi'

export function useArticleAuditLogs(articleId: number) {
  return useQuery({
    queryKey: ['audit', 'article', articleId],
    queryFn: () => getArticleAuditLogs(articleId),
    enabled: !!articleId,
  })
}
