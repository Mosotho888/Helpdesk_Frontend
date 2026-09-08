import { useQuery } from '@tanstack/react-query'
import { getAssets } from '../api/assetApi'
import type { AssetType, AssetStatus } from '../types'

interface UseAssetsParams {
  type?: AssetType
  status?: AssetStatus
  assignedUserId?: number
  page?: number
  size?: number
}

export function useAssets(params: UseAssetsParams = {}) {
  return useQuery({
    queryKey: ['assets', params],
    queryFn: () => getAssets(params),
  })
}
