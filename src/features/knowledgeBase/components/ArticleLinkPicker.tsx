import { useState } from 'react'
import { useArticleSearch } from '../hooks/useArticles'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ArticleLinkPickerProps {
  onLink: (articleId: number) => void
  excludeIds?: number[]
  disabled?: boolean
}

/**
 * Search-driven rather than a dropdown of every article, since browsing a long flat list defeats
 * the point of having full-text search in the first place - an agent linking an article to a
 * ticket is in exactly the same "find the right answer" situation search is built for.
 */
export function ArticleLinkPicker({ onLink, excludeIds = [], disabled }: ArticleLinkPickerProps) {
  const [query, setQuery] = useState('')
  const { data, isLoading } = useArticleSearch(query)
  const excluded = new Set(excludeIds)
  const results = (data?.content ?? []).filter((article) => !excluded.has(article.id))

  return (
    <div className="space-y-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles to link..."
        disabled={disabled}
      />
      {query.trim().length > 0 && (
        <div className="rounded-md border divide-y max-h-56 overflow-y-auto">
          {isLoading && <p className="p-2 text-sm text-muted-foreground">Searching...</p>}
          {!isLoading && results.length === 0 && (
            <p className="p-2 text-sm text-muted-foreground">No matching articles.</p>
          )}
          {results.map((article) => (
            <div key={article.id} className="flex items-center justify-between gap-2 p-2 text-sm">
              <span>{article.title}</span>
              <Button
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() => { onLink(article.id); setQuery('') }}
              >
                Link
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
