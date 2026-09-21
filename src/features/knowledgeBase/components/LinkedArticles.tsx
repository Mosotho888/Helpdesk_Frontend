import { Link } from 'react-router-dom'
import { useTicketArticles, useLinkArticleToTicket, useUnlinkArticleFromTicket } from '../hooks/useTicketArticles'
import { ArticleLinkPicker } from './ArticleLinkPicker'
import { getArticleTypeBadgeClasses, formatArticleType } from '../utils/badgeVariants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function LinkedArticles({ ticketId, canEdit }: { ticketId: number; canEdit: boolean }) {
  const { data: linkedArticles, isLoading } = useTicketArticles(ticketId)
  const linkArticle = useLinkArticleToTicket(ticketId)
  const unlinkArticle = useUnlinkArticleFromTicket(ticketId)

  if (!isLoading && (linkedArticles ?? []).length === 0 && !canEdit) {
    return null // nothing to show a citizen if no article resolved their ticket (yet)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Knowledge Base Articles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}

        {!isLoading && (linkedArticles ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            No articles linked yet.{canEdit ? ' Link one below if it helped resolve this ticket.' : ''}
          </p>
        )}

        {(linkedArticles ?? []).map((article) => (
          <div key={article.id} className="flex items-center justify-between gap-4 rounded-md border p-3 text-sm">
            <div className="space-y-1">
              <Link to={`/knowledge-base/${article.id}`} className="font-medium hover:underline">
                {article.title}
              </Link>
              <div>
                <Badge className={getArticleTypeBadgeClasses(article.type)}>
                  {formatArticleType(article.type)}
                </Badge>
              </div>
            </div>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => unlinkArticle.mutate(article.id)}
                disabled={unlinkArticle.isPending}
              >
                Unlink
              </Button>
            )}
          </div>
        ))}

        {canEdit && (
          <div className="pt-2 border-t">
            <ArticleLinkPicker
              excludeIds={(linkedArticles ?? []).map((a) => a.id)}
              onLink={(articleId) => linkArticle.mutate(articleId)}
              disabled={linkArticle.isPending}
            />
            {linkArticle.isError && (
              <p role="alert" className="text-sm text-destructive mt-2">
                Couldn't link that article - it may already be linked to this ticket.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
