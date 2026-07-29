import { useState, type FormEvent } from 'react'
import { useComments, useAddComment, useAddReply, useUpdateComment, useDeleteComment } from '../hooks/useComments'
import { useAuth } from '../../auth/context/useAuth'
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

function canEditOrDelete(comment: CommentResponse, userId: number | undefined, userRole: string | undefined): boolean {
  if (userRole === 'ADMIN') return true
  if (comment.author.id !== userId) return false
  const fifteenMinutesMs = 15 * 60 * 1000
  const commentAge = Date.now() - new Date(comment.createdAt).getTime()
  return commentAge < fifteenMinutesMs
}

function Comment({ comment, ticketId }: { comment: CommentResponse; ticketId: number }) {
  const { user } = useAuth()
  const [replying, setReplying] = useState(false)
  const [editing, setEditing] = useState(false)
  const [replyBody, setReplyBody] = useState('')
  const [editBody, setEditBody] = useState(comment.body)
  const addReply = useAddReply(ticketId)
  const updateComment = useUpdateComment(ticketId)
  const deleteComment = useDeleteComment(ticketId)

  const canModify = canEditOrDelete(comment, user?.id, user?.role)

  function handleReplySubmit(e: FormEvent) {
    e.preventDefault()
    if (!replyBody.trim()) return
    addReply.mutate(
      { commentId: comment.id, body: replyBody },
      { onSuccess: () => { setReplyBody(''); setReplying(false) } }
    )
  }

  function handleEditSubmit(e: FormEvent) {
    e.preventDefault()
    if (!editBody.trim()) return
    updateComment.mutate(
      { commentId: comment.id, body: editBody },
      { onSuccess: () => setEditing(false) }
    )
  }

  function handleDelete() {
    if (!confirm('Delete this comment? This cannot be undone.')) return
    deleteComment.mutate(comment.id)
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
          <Badge variant="outline" className="ml-2">{comment.type}</Badge>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleEditSubmit} className="flex gap-2 mt-1 mb-2">
          <input
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            className="flex-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <Button type="submit" size="sm" disabled={updateComment.isPending}>Save</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => { setEditing(false); setEditBody(comment.body) }}>
            Cancel
          </Button>
        </form>
      ) : (
        <p className="text-sm mt-1">{comment.body}</p>
      )}

      <div className="flex gap-3 mb-2">
        <button onClick={() => setReplying((r) => !r)} className="text-xs text-primary hover:underline">
          {replying ? 'Cancel' : 'Reply'}
        </button>
        {canModify && !editing && (
          <>
            <button onClick={() => setEditing(true)} className="text-xs text-primary hover:underline">
              Edit
            </button>
            <button onClick={handleDelete} className="text-xs text-destructive hover:underline">
              Delete
            </button>
          </>
        )}
      </div>

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
  const [type, setType] = useState<CommentType>('NOTE')
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