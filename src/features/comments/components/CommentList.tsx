import { useState, type FormEvent } from 'react'
import { useComments, useAddComment } from '../hooks/useComments'
import type { CommentResponse } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function Comment({ comment }: { comment: CommentResponse }) {
  return (
    <div className={comment.parentId ? 'ml-6 pl-4 border-l-2' : ''}>
      <div className="text-sm">
        <span className="font-medium">{comment.author.name}</span>
        <span className="text-muted-foreground ml-2 text-xs">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
        {comment.internal && (
          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
            Internal Note
          </Badge>
        )}
      </div>
      <p className="text-sm mt-1 mb-3">{comment.body}</p>
      {comment.replies.map((reply) => (
        <Comment key={reply.id} comment={reply} />
      ))}
    </div>
  )
}

export function CommentList({ ticketId }: { ticketId: number }) {
  const { data, isLoading } = useComments(ticketId)
  const addComment = useAddComment(ticketId)
  const [body, setBody] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    addComment.mutate({ body }, { onSuccess: () => setBody('') })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        ) : (
          data?.content.map((comment) => <Comment key={comment.id} comment={comment} />)
        )}

        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <Button type="submit" disabled={addComment.isPending}>
            {addComment.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}