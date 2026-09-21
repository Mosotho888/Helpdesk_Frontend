import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createArticle, updateArticle, deleteArticle } from '../api/articleApi'
import type { CreateArticleRequest, UpdateArticleRequest } from '../types'

export function useCreateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateArticleRequest) => createArticle(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['knowledge-base'] }),
  })
}

export function useUpdateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateArticleRequest }) =>
      updateArticle(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] })
      queryClient.invalidateQueries({ queryKey: ['audit', 'article', variables.id] })
    },
  })
}

export function useDeleteArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteArticle(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['knowledge-base'] }),
  })
}
