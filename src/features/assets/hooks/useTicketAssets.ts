import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAssetsForTicket, linkAssetToTicket, unlinkAssetFromTicket } from '../api/assetApi'

export function useTicketAssets(ticketId: number) {
  return useQuery({
    queryKey: ['tickets', ticketId, 'assets'],
    queryFn: () => getAssetsForTicket(ticketId),
    enabled: !!ticketId,
  })
}

export function useLinkAssetToTicket(ticketId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (assetId: number) => linkAssetToTicket(ticketId, assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'assets'] })
      queryClient.invalidateQueries({ queryKey: ['audit', 'ticket', ticketId] })
    },
  })
}

export function useUnlinkAssetFromTicket(ticketId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (assetId: number) => unlinkAssetFromTicket(ticketId, assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'assets'] })
      queryClient.invalidateQueries({ queryKey: ['audit', 'ticket', ticketId] })
    },
  })
}
