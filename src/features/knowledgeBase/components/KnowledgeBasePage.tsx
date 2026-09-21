import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useArticles, useArticleSearch } from '../hooks/useArticles'
import { useAuth } from '../../auth/context/useAuth'
import {
  getArticleStatusBadgeClasses,
  getArticleTypeBadgeClasses,
  formatArticleType,
} from '../utils/badgeVariants'
import type { ArticleType, ArticleStatus } from '../types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function KnowledgeBasePage() {
  const { user } = useAuth()
  const isStaff = user?.role === 'ADMIN' || user?.role === 'AGENT'

  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<ArticleType | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(0)

  const isSearching = query.trim().length > 0
  const searchResult = useArticleSearch(query, page)
  const browseResult = useArticles({
    type: typeFilter === 'ALL' ? undefined : typeFilter,
    status: isStaff && statusFilter !== 'ALL' ? statusFilter : undefined,
    page,
    size: 20,
  })

  const { data, isLoading, isError } = isSearching ? searchResult : browseResult

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground">
            Troubleshooting guides, FAQs, and how-tos - search first, log a ticket if you're still stuck.
          </p>
        </div>
        {isStaff && (
          <Button nativeButton={false} render={<Link to="/knowledge-base/new" />}>
            New Article
          </Button>
        )}
      </div>

      <Input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(0) }}
        placeholder="Search for an answer, e.g. &quot;reset password&quot; or &quot;VPN access&quot;"
        className="h-10"
      />

      {!isSearching && (
        <div className="flex flex-wrap gap-4">
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter((v ?? 'ALL') as ArticleType | 'ALL'); setPage(0) }}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              <SelectItem value="TROUBLESHOOTING_GUIDE">Troubleshooting Guide</SelectItem>
              <SelectItem value="FAQ">FAQ</SelectItem>
              <SelectItem value="STANDARD_OPERATING_PROCEDURE">SOP</SelectItem>
              <SelectItem value="GENERAL">General</SelectItem>
            </SelectContent>
          </Select>

          {isStaff && (
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter((v ?? 'ALL') as ArticleStatus | 'ALL'); setPage(0) }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {isError && <p className="text-sm text-destructive">Something went wrong loading articles.</p>}

      {!isLoading && data?.content.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {isSearching ? `No articles matched "${query}".` : 'No articles yet.'}
        </p>
      )}

      <div className="space-y-3">
        {(data?.content ?? []).map((article) => (
          <Link key={article.id} to={`/knowledge-base/${article.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="py-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-medium">{article.title}</h2>
                  <div className="flex gap-2 shrink-0">
                    <Badge className={getArticleTypeBadgeClasses(article.type)}>
                      {formatArticleType(article.type)}
                    </Badge>
                    {isStaff && (
                      <Badge className={getArticleStatusBadgeClasses(article.status)}>
                        {article.status}
                      </Badge>
                    )}
                  </div>
                </div>
                {article.summary && <p className="text-sm text-muted-foreground">{article.summary}</p>}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {article.categoryName && <span>{article.categoryName}</span>}
                  <span>{article.helpfulCount} found this helpful</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {(data.number ?? 0) + 1} of {data.totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={data.first} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={data.last} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
