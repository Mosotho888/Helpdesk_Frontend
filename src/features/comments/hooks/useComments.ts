import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComments, addComment, addReply, deleteComment, updateComment } from '../api/commentApi'
import type { CommentType } from '../types'

export function useComments(ticketId: number) {
  return useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => getComments(ticketId),
    enabled: !!ticketId,
  })
}

export function useAddComment(ticketId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { body: string; internal?: boolean; type?: CommentType }) =>
      addComment({ ticketId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] })
    },
  })
}

export function useAddReply(ticketId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, body }: { commentId: number; body: string }) => addReply(commentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] })
    },
  })
}

export function useUpdateComment(ticketId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, body }: { commentId: number; body: string }) => updateComment(commentId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', ticketId] }),
  })
}

export function useDeleteComment(ticketId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', ticketId] }),
  })
}