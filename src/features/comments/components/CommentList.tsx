import { useState, type FormEvent } from 'react'
import { useComments, useAddComment, useAddReply } from '../hooks/useComments'
import { useAuth } from '../../auth/context/AuthContext'
import type { CommentResponse, CommentType } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function Comment({ comment, ticketId }: { comment: CommentResponse; ticketId: number }) {
  const [replying, setReplying] = useState(false)
  const [replyBody, setReplyBody] = useState('')
  const addReply = useAddReply(ticketId)

  function handleReplySubmit(e: FormEvent) {
    e.preventDefault()
    if (!replyBody.trim()) return
    addReply.mutate(
      { commentId: comment.id, body: replyBody },
      { onSuccess: () => { setReplyBody(''); setReplying(false) } }
    )
  }

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
        {comment.type !== 'REPLY' && (
          <Badge variant="outline" className="ml-2">
            {comment.type}
          </Badge>
        )}
      </div>
      <p className="text-sm mt-1">{comment.body}</p>

      <button
        onClick={() => setReplying((r) => !r)}
        className="text-xs text-primary hover:underline mb-2"
      >
        {replying ? 'Cancel' : 'Reply'}
      </button>

      {replying && (
        <form onSubmit={handleReplySubmit} className="flex gap-2 mb-3">
          <input
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <Button type="submit" size="sm" disabled={addReply.isPending}>
            {addReply.isPending ? 'Posting...' : 'Reply'}
          </Button>
        </form>
      )}

      {comment.replies.map((reply) => (
        <Comment key={reply.id} comment={reply} ticketId={ticketId} />
      ))}
    </div>
  )
}

export function CommentList({ ticketId }: { ticketId: number }) {
  const { data, isLoading } = useComments(ticketId)
  const addComment = useAddComment(ticketId)
  const { user } = useAuth()
  const [body, setBody] = useState('')
  const [type, setType] = useState<CommentType>('REPLY')
  const [internal, setInternal] = useState(false)

  const canMarkInternal = user?.role === 'AGENT' || user?.role === 'ADMIN'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    addComment.mutate(
      { body, type, internal: canMarkInternal ? internal : false },
      {
        onSuccess: () => {
          setBody('')
          setType('NOTE')
          setInternal(false)
        },
      }
    )
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
          data?.content.map((comment) => <Comment key={comment.id} comment={comment} ticketId={ticketId} />)
        )}

        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />

          <div className="flex items-end gap-4">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => v && setType(v as CommentType)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOTE">Note</SelectItem>
                  <SelectItem value="RESOLUTION">Resolution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {canMarkInternal && (
              <label className="flex items-center gap-2 text-sm pb-1.5">
                <input
                  type="checkbox"
                  checked={internal}
                  onChange={(e) => setInternal(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                Internal note (hidden from requester)
              </label>
            )}
          </div>

          <Button type="submit" disabled={addComment.isPending}>
            {addComment.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}