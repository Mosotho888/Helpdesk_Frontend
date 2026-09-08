import { useQuery } from '@tanstack/react-query'
import { getAsset, getAssetTicketHistory } from '../api/assetApi'

export function useAsset(id: number) {
  return useQuery({
    queryKey: ['assets', id],
    queryFn: () => getAsset(id),
    enabled: !!id,
  })
}

export function useAssetTicketHistory(id: number, page = 0) {
  return useQuery({
    queryKey: ['assets', id, 'tickets', page],
    queryFn: () => getAssetTicketHistory(id, page),
    enabled: !!id,
  })
}
