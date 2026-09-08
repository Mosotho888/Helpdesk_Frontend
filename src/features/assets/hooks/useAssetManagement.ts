import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAsset, updateAsset, retireAsset } from '../api/assetApi'
import type { CreateAssetRequest, UpdateAssetRequest } from '../types'

export function useCreateAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAssetRequest) => createAsset(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  })
}

export function useUpdateAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAssetRequest }) =>
      updateAsset(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  })
}

export function useRetireAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => retireAsset(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  })
}
