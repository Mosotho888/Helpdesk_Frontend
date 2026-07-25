import { useState, type FormEvent } from 'react'
import { useComments, useAddComment } from '../hooks/useComments'
import type { CommentResponse } from '../types'

function Comment({ comment }: { comment: CommentResponse }) {
  return (
    <div style={{ marginLeft: comment.parentId ? '2rem' : 0, marginTop: '0.5rem' }}>
      <strong>{comment.author.name}</strong>
      <span> — {new Date(comment.createdAt).toLocaleString()}</span>
      {comment.internal && <span style={{ color: 'orange' }}> [Internal Note]</span>}
      <p>{comment.body}</p>
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

  if (isLoading) return <p>Loading comments...</p>

  return (
    <div>
      <h2>Comments</h2>
      {data?.content.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}

      <form onSubmit={handleSubmit}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <button type="submit" disabled={addComment.isPending}>
          {addComment.isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  )
}