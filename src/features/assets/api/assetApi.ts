import apiClient from '../../../shared/lib/axiosClient'
import type {
  AssetResponse,
  AssetType,
  AssetStatus,
  CreateAssetRequest,
  UpdateAssetRequest,
  PageAssetResponse,
  PageAssetTicketHistoryResponse,
  TicketAssetLinkResponse,
} from '../types'

interface GetAssetsParams {
  type?: AssetType
  status?: AssetStatus
  assignedUserId?: number
  page?: number
  size?: number
}

export async function getAssets(params: GetAssetsParams = {}): Promise<PageAssetResponse> {
  const response = await apiClient.get<PageAssetResponse>('/assets', {
    params: {
      type: params.type,
      status: params.status,
      assignedUserId: params.assignedUserId,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  })
  return response.data
}

export async function getAsset(id: number): Promise<AssetResponse> {
  const response = await apiClient.get<AssetResponse>(`/assets/${id}`)
  return response.data
}

export async function createAsset(payload: CreateAssetRequest): Promise<AssetResponse> {
  const response = await apiClient.post<AssetResponse>('/assets', payload)
  return response.data
}

export async function updateAsset(id: number, payload: UpdateAssetRequest): Promise<AssetResponse> {
  const response = await apiClient.patch<AssetResponse>(`/assets/${id}`, payload)
  return response.data
}

export async function retireAsset(id: number): Promise<void> {
  await apiClient.delete(`/assets/${id}`)
}

export async function getAssetTicketHistory(
  id: number,
  page = 0,
  size = 20
): Promise<PageAssetTicketHistoryResponse> {
  const response = await apiClient.get<PageAssetTicketHistoryResponse>(`/assets/${id}/tickets`, {
    params: { page, size },
  })
  return response.data
}

// Ticket <-> asset linking

export async function getAssetsForTicket(ticketId: number): Promise<AssetResponse[]> {
  const response = await apiClient.get<AssetResponse[]>(`/tickets/${ticketId}/assets`)
  return response.data
}

export async function linkAssetToTicket(
  ticketId: number,
  assetId: number
): Promise<TicketAssetLinkResponse> {
  const response = await apiClient.post<TicketAssetLinkResponse>(
    `/tickets/${ticketId}/assets/${assetId}`
  )
  return response.data
}

export async function unlinkAssetFromTicket(ticketId: number, assetId: number): Promise<void> {
  await apiClient.delete(`/tickets/${ticketId}/assets/${assetId}`)
}
