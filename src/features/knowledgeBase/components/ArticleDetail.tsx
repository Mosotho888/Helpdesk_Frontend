import { useParams, Link } from 'react-router-dom'
import { useArticle, useArticleFeedback, useSubmitFeedback, useArticleTicketHistory } from '../hooks/useArticle'
import { useUpdateArticle } from '../hooks/useArticleManagement'
import { useAuth } from '../../auth/context/useAuth'
import { ArticleAuditTrail } from './ArticleAuditTrail'
import { getArticleStatusBadgeClasses, getArticleTypeBadgeClasses, formatArticleType } from '../utils/badgeVariants'
import type { ArticleStatus } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const articleId = Number(id)
  const { user } = useAuth()
  const isStaff = user?.role === 'ADMIN' || user?.role === 'AGENT'

  const { data: article, isLoading, isError } = useArticle(articleId)
  const { data: feedback } = useArticleFeedback(articleId)
  const submitFeedback = useSubmitFeedback(articleId)
  const { data: history } = useArticleTicketHistory(articleId)
  const updateArticle = useUpdateArticle()

  if (isLoading) return <p className="p-6 text-muted-foreground">Loading article...</p>
  if (isError || !article) return <p className="p-6 text-destructive">Article not found.</p>

  function handleStatusChange(status: string | null) {
    if (!status) return
    updateArticle.mutate({ id: articleId, payload: { status: status as ArticleStatus } })
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{article.title}</CardTitle>
              {article.summary && <p className="text-sm text-muted-foreground mt-1">{article.summary}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <Badge className={getArticleTypeBadgeClasses(article.type)}>
                {formatArticleType(article.type)}
              </Badge>
              {isStaff && (
                <Badge className={getArticleStatusBadgeClasses(article.status)}>{article.status}</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{article.content}</div>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Was this helpful?</span>
              <Button
                size="sm"
                variant={feedback?.yourVote === true ? 'default' : 'outline'}
                onClick={() => submitFeedback.mutate({ helpful: true })}
                disabled={submitFeedback.isPending}
              >
                <ThumbsUp className="h-4 w-4 mr-1" /> {article.helpfulCount}
              </Button>
              <Button
                size="sm"
                variant={feedback?.yourVote === false ? 'default' : 'outline'}
                onClick={() => submitFeedback.mutate({ helpful: false })}
                disabled={submitFeedback.isPending}
              >
                <ThumbsDown className="h-4 w-4 mr-1" /> {article.notHelpfulCount}
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">{article.viewCount} views</span>
          </div>

          {isStaff && (
            <div className="flex items-center justify-between gap-4 pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={article.status === 'PUBLISHED' || updateArticle.isPending}
                  onClick={() => handleStatusChange('PUBLISHED')}
                >
                  Publish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={article.status === 'ARCHIVED' || updateArticle.isPending}
                  onClick={() => handleStatusChange('ARCHIVED')}
                >
                  Archive
                </Button>
              </div>
              <Button size="sm" nativeButton={false} render={<Link to={`/knowledge-base/${articleId}/edit`} />}>
                Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isStaff && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Usage History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(history?.content ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">Not yet linked to any ticket.</p>
            )}
            {(history?.content ?? []).map((entry) => (
              <Link
                key={entry.ticketId}
                to={`/tickets/${entry.ticketId}`}
                className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/50"
              >
                <span>{entry.subject}</span>
                <span className="text-muted-foreground">
                  {entry.status.replace('_', ' ')} - {new Date(entry.linkedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {isStaff && <ArticleAuditTrail articleId={articleId} />}
    </div>
  )
}
