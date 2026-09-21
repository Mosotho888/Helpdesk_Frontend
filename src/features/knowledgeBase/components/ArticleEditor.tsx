import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useArticle } from '../hooks/useArticle'
import { useCreateArticle, useUpdateArticle } from '../hooks/useArticleManagement'
import { CategorySelect } from '../../categories/components/CategorySelect'
import type { ArticleType } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ArticleEditor() {
  const { id } = useParams<{ id: string }>()
  const isEditMode = id != null
  const articleId = Number(id)
  const navigate = useNavigate()

  const { data: existing, isLoading } = useArticle(isEditMode ? articleId : 0)
  const createArticle = useCreateArticle()
  const updateArticle = useUpdateArticle()

  if (isEditMode && isLoading) {
    return <p className="p-6 text-muted-foreground">Loading article...</p>
  }

  return (
    <ArticleForm
      key={existing?.id ?? 'new'}
      initial={existing}
      onSubmit={(values) => {
        if (isEditMode) {
          updateArticle.mutate(
            { id: articleId, payload: values },
            { onSuccess: () => navigate(`/knowledge-base/${articleId}`) }
          )
        } else {
          createArticle.mutate(values, {
            onSuccess: (created) => navigate(`/knowledge-base/${created.id}`),
          })
        }
      }}
      isPending={isEditMode ? updateArticle.isPending : createArticle.isPending}
      isError={isEditMode ? updateArticle.isError : createArticle.isError}
      submitLabel={isEditMode ? 'Save Changes' : 'Create Draft'}
      title={isEditMode ? 'Edit Article' : 'New Article'}
    />
  )
}

interface ArticleFormValues {
  title: string
  summary?: string
  content: string
  type: ArticleType
  categoryId?: number
  clearCategory?: boolean
  tags?: string[]
}

function ArticleForm({
  initial,
  onSubmit,
  isPending,
  isError,
  submitLabel,
  title,
}: {
  initial?: { title: string; summary: string | null; content: string; type: ArticleType; categoryId: number | null; tags: string[] }
  onSubmit: (values: ArticleFormValues) => void
  isPending: boolean
  isError: boolean
  submitLabel: string
  title: string
}) {
  const [formTitle, setFormTitle] = useState(initial?.title ?? '')
  const [summary, setSummary] = useState(initial?.summary ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [type, setType] = useState<ArticleType>(initial?.type ?? 'FAQ')
  const [categoryId, setCategoryId] = useState<number | null>(initial?.categoryId ?? null)
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(', '))

  function handleSubmit() {
    if (!formTitle.trim() || !content.trim()) return
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    onSubmit({
      title: formTitle.trim(),
      summary: summary.trim() || undefined,
      content: content.trim(),
      type,
      categoryId: categoryId ?? undefined,
      clearCategory: categoryId == null,
      tags,
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="article-title">Title</Label>
            <Input id="article-title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="article-summary">Summary</Label>
            <Input
              id="article-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="One or two sentences shown in search results"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="article-type">Type</Label>
              <Select value={type} onValueChange={(v) => v && setType(v as ArticleType)}>
                <SelectTrigger id="article-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TROUBLESHOOTING_GUIDE">Troubleshooting Guide</SelectItem>
                  <SelectItem value="FAQ">FAQ</SelectItem>
                  <SelectItem value="STANDARD_OPERATING_PROCEDURE">SOP</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="article-category">Category</Label>
              <CategorySelect
                id="article-category"
                value={categoryId}
                onChange={setCategoryId}
                noneLabel="No category"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="article-content">Content</Label>
            <Textarea
              id="article-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Write the guide, FAQ answer, or procedure here..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="article-tags">Tags</Label>
            <Input
              id="article-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Comma-separated, e.g. vpn, remote-work"
            />
          </div>

          {isError && (
            <p role="alert" className="text-sm text-destructive">
              Couldn't save the article. Please check the fields and try again.
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!formTitle.trim() || !content.trim() || isPending}
            className="w-full"
          >
            {isPending ? 'Saving...' : submitLabel}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
