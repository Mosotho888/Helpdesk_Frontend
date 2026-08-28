import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory, updateCategory, deactivateCategory } from '../api/categoryApi'
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../types'

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCategoryRequest) => createCategory(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryRequest }) =>
      updateCategory(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDeactivateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deactivateCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })
}
